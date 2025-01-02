<template>
  <div class="home-page h-screen flex flex-col p-4">
    <!-- affiche lenom de l'utilisateur connecté -->
    <div>
      <h1 class="text-2xl font-bold mb-4">Bienvenue, {{ authStore.contact?.fullname }}</h1>
    </div>
    <!-- Recherche de contacts -->
    <div class="search-bar mb-4">
      <input v-model="searchQuery" @input="searchContacts" type="text" placeholder="Rechercher des contacts..."
        class="input input-bordered w-full" />
    </div>

    <!-- Résultats de recherche -->
    <div v-if="searchResults.length" class="search-results mb-4">
      <h3 class="text-lg font-bold mb-2">Résultats de recherche</h3>
      <ul>
        <li v-for="result in searchResults" :key="result.id" class="p-2 border-b flex justify-between items-center">
          <span>{{ result.fullname }} ({{ result.email }})</span>
          <button @click="addContact(result.id)" class="btn btn-primary">
            Ajouter
          </button>
        </li>
      </ul>
    </div>

    <!-- Liste des contacts -->
    <div class="contacts-list">
      <h2>Mes contacts :</h2>
      <ul>
        <li v-for="contact in listContacts" :key="contact.id" class="contact-item">
          <span>{{ contact.fullname }}</span>
          <button @click="openChat(contact.id)" class="chat-btn">Discussion</button>
          <button @click="removeContact(contact.id)" class="remove-btn">Supprimer</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useContactsStore } from "@/stores/contacts";
import { useAuthStore } from "@/stores/auth";
import { Contact } from "@/types/contacts";
import { searchContactAPI } from "@/api/contacts";

export default {
  name: "dashboard",
  setup() {
    const contactsStore = useContactsStore();
    const router = useRouter();
    const listContacts = ref<Contact[]>([]);

    const searchQuery = ref("");
    const searchResults = ref<Contact[]>([]);

    onMounted(() => {
      contactsStore.loadContacts();
    });

    const searchContacts = async () => {
      if (searchQuery.value.trim()) {
        searchResults.value = await searchContactAPI(searchQuery.value);
      } else {
        searchResults.value = [];
      }
    };

    const addContact = async (contactId: string) => {
      await contactsStore.addContact(contactId);
      searchQuery.value = "";
    };

    const removeContact = async (contactId: string) => {
      await contactsStore.removeContact(contactId);
    };

    const openChat = (contactId: string) => {
      router.push({ name: "Chat", params: { id: contactId } });
    };

    return {
      searchQuery,
      searchResults,
      contacts: contactsStore.contacts,
      searchContacts,
      addContact,
      removeContact,
      openChat,
      authStore: useAuthStore(),
      listContacts : contactsStore.contacts,
    };
  },
};
</script>
