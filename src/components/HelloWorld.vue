<template>
  <div>
    <h1 class="text-xl font-bold">Messagerie Instantanée</h1>
    <div class="chat-window">
      <div v-for="msg in messages" :key="msg.id" class="chat-message">
        <div :class="msg.type === 'sent' ? 'chat-bubble chat-end' : 'chat-bubble chat-start'">
          {{ msg.content }}
        </div>
      </div>
    </div>
    <input
      type="text"
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Écrire un message..."
      class="input input-bordered w-full"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      ws: null,
      messages: [],
      newMessage: "",
    };
  },
  methods: {
    connectWebSocket() {
      this.ws = new WebSocket("ws://localhost:8000/ws");
      this.ws.onmessage = (event) => {
        this.messages.push({ type: "received", content: event.data });
      };
    },
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.ws.send(this.newMessage);
        this.messages.push({ type: "sent", content: this.newMessage });
        this.newMessage = "";
      }
    },
  },
  mounted() {
    this.connectWebSocket();
  },
};
</script>
