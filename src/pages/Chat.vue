<template>
    <div class="flex flex-col">
      <!-- Header -->
      <div class="header text-white p-4 flex self-center">
        <h2 class="text-lg font-bold">Chat avec {{ otherUser.name }}</h2>
      </div>
  
      <!-- Messages -->
      <div class="messages flex-1 p-4  overflow-y-auto" ref="messageContainer">
        <div v-for="message in messages" :key="message.id" class="mb-4">
          <div
            :class="{
              'self-end bg-blue-500 text-white': message.sender_id === userId,
              'self-start bg-gray-300 text-black': message.sender_id !== userId,
            }"
            class="p-2 rounded-lg max-w-xs"
          >
            {{ message.text }}
            <span v-if="message.edited" class="text-xs text-gray-500">(modifié)</span>
          </div>
        </div>
      </div>
  
      <!-- Input -->
      <div class="w-full absolute inset-x-0 bottom-0 p-4 ">
        <div class="flex items-center"> 
          <input
          v-model="newMessage"
          type="text"
          placeholder="Écrivez un message..."
          class="input input-bordered align-middle flex-1 w-2/3 "
          />
          <button @click="handleSendMessage" class="btn btn-primary ml-2"><font-awesome-icon icon="fa-solid fa-paper-plane" /></button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { ref, onMounted, onUpdated } from "vue";
  import { getConversation, sendMessage, editMessage } from "@/api/messages";
  import { useAuthStore } from "@/stores/auth";
  
  export default {
    name: "Chat",
    setup() {
      const authStore = useAuthStore();
      const userId = authStore.user?.id || "";
      const otherUser = ref({ id: "2", name: "Utilisateur 2" }); // Id utilisateur cible
      const messages = ref<any[]>([]);
      const newMessage = ref("");
      const messageContainer = ref<HTMLDivElement | null>(null);
  
      // Charger les messages
      const loadMessages = async () => {
        messages.value = await getConversation(otherUser.value.id);
      };
  
      // Envoyer un message
      const handleSendMessage = async () => {
        if (!newMessage.value.trim()) return;
  
        const messageData = {
          receiver_id: otherUser.value.id,
          message: newMessage.value,
        };
  
        const sentMessage = await sendMessage(messageData);
        messages.value.push(sentMessage);
        newMessage.value = "";
        scrollToBottom();
      };
  
      // Faire défiler vers le bas
      const scrollToBottom = () => {
        if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
        }
      };
  
      onMounted(async () => {
        await loadMessages();
        scrollToBottom();
      });
  
      onUpdated(scrollToBottom);
  
      return { userId, otherUser, messages, newMessage, handleSendMessage, messageContainer };
    },
  };
  </script>

  