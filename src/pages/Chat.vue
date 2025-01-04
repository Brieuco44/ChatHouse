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
      <!-- Chat Messages -->
      <div v-for="message in messages" :key="message.id" class="mb-4">
        <!-- Sent Message -->
        <div v-if="message.sender_id === currentUserId" class="flex justify-end">
          <div class="relative">
            <div class="bg-primary text-white rounded-lg px-4 py-3 max-w-xs shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              {{ message.text }}
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs text-gray-200">{{ formatDate(message.date) }}</span>
                <button @click="Supprmessage(message.id)" class="text-white hover:text-red-500 transition-colors duration-200">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </button>
              </div>
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
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { joinConversationRoom, leaveConversationRoom } from "@/plugins/socket";
import socket from "@/plugins/socket";
import {sendMessage, fetchConversation, deleteMessage} from "@/api/messages";
import { useAuthStore } from "@/stores/auth";
import { Message } from "@/types/messages";

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

    // Charger les messages de la conversation
    const loadMessages = async () => {
      try {
        console.log("Loading messages...");

        const response = await fetchConversation(receiverId);
        console.log("Messages loaded:", response.data);

        messages.value = response.data;
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    // Envoyer un message
    const sendMessageToServer = async () => {
      if (!messageText.value.trim()) return;

      const text = messageText.value.trim();
      messageText.value = "";

      try {
        const response = await sendMessage(receiverId, text);
        // messages.value.push(text); // Ajoute le message immédiatement
        console.log(messages.value);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    };

    // Recevoir un message en temps réel
    const receiveMessage = (message: any) => {
      console.log("Received message:", message);

      if (
        (message.sender_id === currentUserId && message.receiver_id === receiverId) ||
        (message.receiver_id === currentUserId && message.sender_id === receiverId)
      ) {
        messages.value.push(message);
      }
    };

    const Supprmessage = async (messageId: string) => {
      try {
        await deleteMessage(messageId);
        messages.value = messages.value.filter((message) => message.id !== messageId);
      } catch (error) {
        console.error("Failed to delete message:", error);
      }
    };

    const formatDate = (timestamp: number) => {
      const optionsTime = { hour: "numeric", minute: "numeric", hour12: false };
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
      loadMessages();
      joinConversationRoom(conversationId);

      socket.on("new_message", receiveMessage);

      // Clean up on unmount
      return () => {
        leaveConversationRoom(conversationId);
        socket.off("new_message", receiveMessage);
      };
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
    };
  },
});
</script>