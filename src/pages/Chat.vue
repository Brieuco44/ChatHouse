<template>
  <div class="flex flex-col">
    <!-- Header -->
    <div class="header text-white p-4 flex self-center">
      <h2 class="text-lg font-bold">Chat avec {{ }}</h2>
    </div>

    <!-- Messages -->
    <div class="flex-1 p-4 overflow-y-auto">
      <!-- Chat Messages -->
      <div v-for="message in messages" :key="message.id" class="mb-4">
        <!-- Sent Message -->
        <div v-if="message.sender_id === currentUserId" class="flex justify-end">
          <div class="bg-primary text-white rounded-lg px-4 py-2 max-w-xs">
            {{ message.text }}
            <!-- <span class="text-xs text-gray-300 block text-right mt-1">{{ formatDate(message.date) }}</span> -->
          </div>
        </div>
        <!-- Received Message -->
        <div v-else class="flex justify-start">
          <div class="bg-base-300 text-black rounded-lg px-4 py-2 max-w-xs">
            {{ message.text }}
            <!-- <span class="text-xs text-gray-500 block text-right mt-1">{{ formatDate(message.date) }}</span> -->
          </div>
        </div>
      </div>
    </div>

      <!-- Input -->
      <div class="w-full absolute inset-x-0 bottom-0 p-4 ">
        <div class="flex items-center">
          <input v-model="messageText" type="text" @keypress.enter="sendMessage"
            class="input input-bordered align-middle flex-1 w-2/3" placeholder="Écrire un message..." />
          <button @click="sendMessage" class="btn btn-primary ml-2"><font-awesome-icon
              icon="fa-solid fa-paper-plane" /></button>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { joinConversationRoom, leaveConversationRoom } from "@/plugins/socket";
import socket from "@/plugins/socket";
import { sendMessage, fetchConversation } from "@/api/messages";
import { useAuthStore } from "@/stores/auth";

export default defineComponent({
  setup() {
    const route = useRoute();
    const conversationId = route.params.room as string;
    const receiverId = route.params.id as string;
    const authStore = useAuthStore();
    const currentUserId = authStore.contact?.id || null;
    const messages = ref<any[]>([]);
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
        const response = await sendMessage(conversationId, text);
        messages.value.push(response.data); // Ajoute le message immédiatement
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    };

    // Recevoir un message en temps réel
    const receiveMessage = (message: any) => {
      if (
        (message.sender_id === currentUserId && message.receiver_id === conversationId) ||
        (message.receiver_id === currentUserId && message.sender_id === conversationId)
      ) {
        messages.value.push(message);
      }
    };

    onMounted(() => {
      loadMessages();

      const room = `conversation_${conversationId}`;
      joinConversationRoom(room);

      socket.on("new_message", receiveMessage);

      // Clean up on unmount
      return () => {
        leaveConversationRoom(room);
        socket.off("new_message", receiveMessage);
      };
    });

    return {
      messages,
      messageText,
      currentUserId,
      contactName,
      sendMessage: sendMessageToServer,
    };
  },
});
</script>