<template>
  <div class="flex flex-col">
    <!-- Header -->
    <div class="header text-white p-4 flex self-center">
      <h2 class="text-lg font-bold">Chat avec {{  }}</h2>
    </div>

    <!-- Messages -->
    <div class="messages flex-1 p-4  overflow-y-auto" ref="messageContainer">
      <div v-for="message in messages" :key="message.id" class="mb-4">
        <div class="messages-list">
          <div v-for="message in messages" :key="message.id" :class="messageClass(message)">
            {{ message.text }}
            <small class="message-meta">
          {{ formatDate(message.date) }}
          <span v-if="message.edited">(edited)</span>
        </small>
            <div v-if="message.sender_id === userId" class="actions">
              <button @click="editMessagePrompt(message.id)">Modifier</button>
              <button @click="removeMessage(message.id)">Supprimer</button>
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
              icon="fa-solid fa-paper-plane"/></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { joinConversationRoom, leaveConversationRoom } from "@/plugins/socket";
import socket from "@/plugins/socket";
import { sendMessage } from "@/api/messages";
import { useAuthStore } from "@/stores/auth";

export default defineComponent({
  setup() {
    const route = useRoute();
    const conversationId = route.params.id as string;
    const currentUserId = useAuthStore.$id; // Assuming user ID is stored in localStorage
    const messages = ref<any[]>([]);
    const messageText = ref("");

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString();
    };

    const loadMessages = async () => {
      // Placeholder: replace with API call to fetch messages
      messages.value =  [];
    };

    const sendMessageToServer = async () => {
      if (!messageText.value.trim()) return;
      const text = messageText.value.trim();
      messageText.value = "";

      try {
        const response = await sendMessage(conversationId, text);
        messages.value.push(response.data);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    };

    const receiveMessage = (message: any) => {
      if (message.receiver_id === currentUserId) {
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
      formatDate,
      sendMessage: sendMessageToServer,
    };
  },
});
</script>