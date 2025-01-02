<template>
  <div class="flex flex-col">
    <!-- Header -->
    <div class="header text-white p-4 flex self-center">
      <h2 class="text-lg font-bold">Chat avec {{ contactName }}</h2>
    </div>

    <!-- Messages -->
    <div class="messages flex-1 p-4  overflow-y-auto" ref="messageContainer">
      <div v-for="message in messages" :key="message.id" class="mb-4">
        <div class="messages-list">
          <div v-for="message in messages" :key="message.id" :class="messageClass(message)">
            {{ message.text }}
            <small>{{ formatDate(message.date) }}</small>
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
          <input v-model="newMessage" @keypress.enter="sendMessage" class="input input-bordered align-middle flex-1 w-2/3" type="text" placeholder="Écrire un message..." />
          <button @click="sendMessage" class="btn btn-primary ml-2"><font-awesome-icon
              icon="fa-solid fa-paper-plane" /></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  sendMessageAPI,
  editMessageAPI,
  removeMessageAPI,
  joinRoomAPI,
} from "@/api/messages";
import {Message} from "@/types/messages";
import socket from "@/plugins/socket";

export default {
  name: "Chat",
  setup() {
    const route = useRoute();
    const userId = localStorage.getItem("user_id")!;
    const contactId = route.params.id as string;

    const messages = ref<Message[]>([]);
    const newMessage = ref("");
    const contactName = ref("Nom du contact"); // Charger le vrai nom via une API

    const loadMessages = async () => {
      // Charger les messages de l'API
      messages.value = []; // Remplace par une API si nécessaire
    };

    const sendMessage = async () => {
      if (newMessage.value.trim()) {
        await sendMessageAPI(contactId, newMessage.value);
        newMessage.value = "";
      }
    };

    const editMessagePrompt = (messageId: string) => {
      const newText = prompt("Modifier le message :");
      if (newText) editMessage(messageId, newText);
    };

    const editMessage = async (messageId: string, newText: string) => {
      await editMessageAPI(messageId, newText);
    };

    const removeMessage = async (messageId: string) => {
      await removeMessageAPI(messageId);
    };

    const messageClass = (message: any) =>
      message.sender_id === userId ? "sent" : "received";

    const formatDate = (date: string) => new Date(date).toLocaleString();

    // Gérer les événements Socket.IO
    const setupSocket = () => {
      joinRoomAPI(socket, userId, `conversation_${userId}_${contactId}`);

      socket.on("new_message", (data) => {
        if (
          data.sender_id === contactId ||
          data.receiver_id === contactId
        ) {
          messages.value.push(data);
        }
      });

      socket.on("edit_message", (data) => {
        const message = messages.value.find((m) => m.id === data.message_id);
        if (message) {
          message.text = data.new_text;
          message.edited = true;
        }
      });

      socket.on("remove_message", (data) => {
        messages.value = messages.value.filter(
          (m) => m.id !== data.message_id
        );
      });
    };

    onMounted(() => {
      loadMessages();
      setupSocket();
    });

    return {
      messages,
      newMessage,
      contactName,
      sendMessage,
      editMessagePrompt,
      removeMessage,
      formatDate,
      messageClass,
      userId,
    };
  },
};
</script>