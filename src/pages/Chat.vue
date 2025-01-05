<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <div class="header text-white p-4 flex self-center">
      <h2 class="text-lg font-bold">Chat avec {{ fullname }}</h2>
    </div>

    <!-- Messages -->
    <div
        ref="messagesContainer"
        class="flex-1 p-4 overflow-y-auto mb-16 flex flex-col-reverse"
    >
      <div
          v-for="message in messages"
          :key="message.id"
          class="mb-4 relative group"
          @mouseover="hoveredMessageId = message.id"
          @mouseleave="hoveredMessageId = null"
      >
        <!-- Sent Message -->
        <div v-if="message.sender_id === currentUserId" class="flex justify-end">
          <div class="relative">
            <div
                :class="[
                'rounded-lg px-4 py-3 max-w-xs shadow-lg',
                message.id.includes('offline-') ? 'bg-red-500 text-white' : 'bg-primary text-white'
              ]"
            >
              {{ message.text }}
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs text-gray-200">{{ formatDate(message.date) }}</span>
              </div>
            </div>
            <p v-if="message.edited" class="text-xs text-gray-400 text-right mt-1">edited</p>
            <p
                v-if="message.id.includes('offline-')"
                class="text-xs text-red-400 text-right mt-1"
            >
              Failed to send
            </p>

            <!-- Trois points -->
            <div
                v-if="hoveredMessageId === message.id"
                class="absolute top-0 right-0 mr-2 cursor-pointer"
                @click="openContextMenu(message)"
            >
              <span class="text-gray-400 hover:text-gray-600">...</span>
            </div>

            <!-- Menu contextuel -->
            <div
                v-if="contextMenuMessageId === message.id"
                class="absolute top-0 right-full mr-2 flex flex-col bg-gray-800 text-white p-2 rounded shadow z-20"
            >
              <button
                  @click="editMessage(message)"
                  class="hover:text-yellow-400 mb-1 transition"
              >
                Modifier
              </button>
              <button
                  @click="Supprmessage(message.id)"
                  class="hover:text-red-500 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

        <!-- Received Message -->
        <div v-else class="flex justify-start">
          <div class="relative">
            <div class="bg-base-300 text-white rounded-lg px-4 py-3 max-w-xs shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              {{ message.text }}
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs text-gray-400">{{ formatDate(message.date) }}</span>
              </div>
            </div>
            <p v-if="message.edited" class="text-xs text-gray-400 text-left mt-1">edited</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="w-full p-4 bg-base-100 sticky bottom-0 z-10">
      <div class="flex items-center">
        <input
            v-model="messageText"
            type="text"
            @keypress.enter="sendMessage"
            class="input input-bordered flex-1"
            placeholder="Écrire un message..."
        />
        <button @click="sendMessage" class="btn btn-primary ml-2">
          <font-awesome-icon icon="fa-solid fa-paper-plane" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, onBeforeUnmount} from "vue";
import { useRoute } from "vue-router";
import { joinConversationRoom, leaveConversationRoom } from "@/plugins/socket";
import socket from "@/plugins/socket";
import { sendMessage, fetchConversation, deleteMessage, updateMessage} from "@/api/messages";
import { useAuthStore } from "@/stores/auth";
import { Message } from "@/types/messages";
import { useNetwork } from "@vueuse/core";
import {watchLocalStorage} from "@/api/apirequest";

export default defineComponent({
  setup() {
    const route = useRoute();
    const conversationId = route.params.room as string;
    const receiverId = route.params.id as string;
    const fullname = route.params.fullname as string;
    const authStore = useAuthStore();
    const currentUserId = authStore.contact?.id || null;
    const messages = ref<Message[]>([]);
    const messageText = ref("");
    const contactName = ref("Contact");
    const hoveredMessageId = ref<string | null>(null);
    const contextMenuMessageId = ref<string | null>(null);
    const { isOnline } = useNetwork();

    // Charger les messages de la conversation
    const loadMessages = async () => {
      try {
        const response = await fetchConversation(receiverId);
        messages.value = response;
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    // Envoyer un message
    const sendMessageToServer = async () => {
      if (!messageText.value.trim()) return;

      const text = messageText.value.trim();
      messageText.value = "";

      let timestampInSeconds = Math.floor(Date.now() / 1000);

      // if offline unshift the message bc it will be added to the chat when the user is back online
      let idoffline = null;
      if (!isOnline.value) {
        idoffline = "offline-" + Date.now();
        messages.value.unshift({
          id: idoffline, // how can we associate this with the actual message id?
          sender_id: currentUserId as string,
          receiver_id: receiverId,
          text,
          date: timestampInSeconds.toString(),
          edited: false,
        });
      }

      try {
        const response = await sendMessage(receiverId, text,idoffline);
        // messages.value.push(text); // Ajoute le message immédiatement
        //console.log(messages.value);

      } catch (error) {
        console.error("Failed to send message:", error);
      }
    };

    // Recevoir un message en temps réel
    const receiveMessage = (message: any) => {
      // if offline add to the chat
      console.log("Received message:", message);

      if (
          (message.sender_id === currentUserId && message.receiver_id === receiverId) ||
          (message.receiver_id === currentUserId && message.sender_id === receiverId)
      ) {
        messages.value.unshift(message);
      }
    };

    const receiveUpdateMessage = (editEvent: any) => {
      console.log("Received edit event:", editEvent);

      // Extract relevant data from the emitted event
      const { message_id, new_text, edited } = editEvent;

      // Update the message in the list if it exists
      messages.value = messages.value.map((msg) => {
        if (msg.id === message_id) {
          return {
            ...msg,
            text: new_text,
            edited: edited || false, // Default to false if `edited` is not present
          };
        }
        return msg;
      });
    };


    // Supprimer un message
    const Supprmessage = async (messageId: string) => {
      try {
        await deleteMessage(messageId);
        messages.value = messages.value.filter((message) => message.id !== messageId);
      } catch (error) {
        console.error("Failed to delete message:", error);
      }
    };

    const openContextMenu = (message: Message) => {
      contextMenuMessageId.value = contextMenuMessageId.value === message.id ? null : message.id;
    };


    // Modifier un message
    const editMessage = async (message: Message) => {
      const newText = prompt("Modifier le message :", message.text);

      if(!isOnline.value){
        // update the message in the chat
        messages.value = messages.value.map((msg) => {
          if (msg.id === message.id) {
            return {
              ...msg,
              text: newText,
              edited: true,
            };
          }
          return msg;
        });
      }


      if (newText && newText.trim() !== message.text) {
        try {
          const updatedMessage = await updateMessage(receiverId,message.id, newText.trim());
        } catch (error) {
          console.error("Failed to edit message:", error);
        }
      }
    };

    const formatDate = (date: string) => {
      // Convert the timestamp to number
      const timestamp = Number(date);

      const optionsTime: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric", hour12: false };
      const messageDate = new Date(timestamp * 1000); // Convert from seconds to milliseconds
      const currentDate = new Date();
      const diff = currentDate.getTime() - messageDate.getTime();

      // If less than 1 minute
      if (diff < 60000) { // 60,000 ms = 1 minute
        return "now";
      }

      // If less than 24 hours
      if (diff < 86400000) { // 86,400,000 ms = 24 hours
        return messageDate.toLocaleTimeString("fr-FR", optionsTime);
      }

      // Return the full date in French if more than 24 hours
      return messageDate.toLocaleDateString("fr-FR");
    };



    onMounted(() => {
      loadMessages(); // Assume this function loads previously saved messages
      joinConversationRoom(conversationId);
      watchLocalStorage(conversationId);

      socket.on("new_message", receiveMessage);
      socket.on("edit_message", receiveUpdateMessage);
      socket.on("reload_messages", loadMessages);

      // Clean up on unmount
      onBeforeUnmount(() => {
        leaveConversationRoom(conversationId);
        socket.off("new_message", receiveMessage);
        socket.off("edit_message", receiveUpdateMessage);
      });
    });

    return {
      fullname,
      messages,
      messageText,
      currentUserId,
      contactName,
      sendMessage: sendMessageToServer,
      Supprmessage,
      formatDate,
      editMessage,
      hoveredMessageId,
      contextMenuMessageId,
      openContextMenu
    };
  },
});

</script>