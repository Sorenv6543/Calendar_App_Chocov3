<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const userStore = useUserStore();
const router = useRouter();
const isEditing = ref(false);
const isSaving = ref(false);
const showSuccessAlert = ref(false);
const errorMessage = ref('');

// Form data
const formData = ref({
    fullName: '',
    email: '',
    phone: ''
});

// Load user data when component mounts
onMounted(() => {
    if (userStore.userData) {
        formData.value.fullName = userStore.userData.fullName || '';
        formData.value.email = userStore.userData.email || '';
    }
});

// Computed property for user's initial
const userInitial = computed(() => {
    if (formData.value.fullName) {
        return formData.value.fullName.charAt(0).toUpperCase();
    }
    if (formData.value.email) {
        return formData.value.email.charAt(0).toUpperCase();
    }
    return 'U';
});

// Computed property for total houses count
const totalHouses = computed(() => {
    return userStore.houses?.length || 0;
});

async function saveProfile() {
    try {
        isSaving.value = true;
        errorMessage.value = '';

        if (!userStore.userData?.id) {
            throw new Error('No user is logged in');
        }

        // Update user document in Firestore
        const userDocRef = doc(db, "users", userStore.userData.id);
        await updateDoc(userDocRef, {
            fullName: formData.value.fullName,
        });

        // Update local state
        userStore.userData.fullName = formData.value.fullName;

        isEditing.value = false;
        showSuccessAlert.value = true;

        // Hide success alert after 3 seconds
        setTimeout(() => {
            showSuccessAlert.value = false;
        }, 3000);
    } catch (error) {
        console.error('Error updating profile:', error);
        errorMessage.value = error.message || 'Failed to update profile';
    } finally {
        isSaving.value = false;
    }
}

function cancelEdit() {
    // Reset form to current values
    formData.value.fullName = userStore.userData?.fullName || '';
    isEditing.value = false;
    errorMessage.value = '';
}

function goBack() {
    router.push('/home');
}
On
</script>

<template>
    <v-container fluid class="profile-container pa-4 pa-md-6 ma-0">
        <v-row>
            <v-col cols="12">
                <div class="d-flex align-center mb-4">
                    <v-btn icon variant="text" class="mr-2" @click="goBack">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <h1 class="text-h4 font-weight-bold">Profile Settings</h1>
                </div>
            </v-col>
        </v-row>

        <v-row class="profile-content">
            <v-col cols="12" md="4">
                <v-card class="mb-4 profile-card" elevation="2" rounded="lg">
                    <v-card-text class="text-center pa-6">
                        <v-avatar size="96" color="primary" class="mb-4">
                            <span class="text-h4 font-weight-medium white--text">{{ userInitial }}</span>
                        </v-avatar>

                        <h2 class="text-h5 font-weight-bold">
                            {{ userStore.userData?.fullName || 'Guest User' }}
                        </h2>
                        <p class="text-body-1 text-medium-emphasis">
                            {{ userStore.userData?.email || 'No email provided' }}
                        </p>

                        <v-divider class="my-4"></v-divider>

                        <div class="d-flex justify-space-around mb-2">
                            <div class="text-center">
                                <div class="text-h5 font-weight-bold">{{ totalHouses }}</div>
                                <div class="text-caption text-medium-emphasis">Properties</div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="8">
                <v-card class="profile-card" elevation="2" rounded="lg">
                    <v-card-title class="d-flex justify-space-between align-center pa-6">
                        <span class="text-h5">Personal Information</span>
                        <v-btn v-if="!isEditing" color="primary" variant="text" @click="isEditing = true">
                            <v-icon left>mdi-pencil</v-icon>
                            Edit
                        </v-btn>
                    </v-card-title>

                    <v-card-text class="pa-6 pt-2">
                        <v-alert v-if="showSuccessAlert" type="success" variant="tonal" class="mb-4" density="compact">
                            Profile updated successfully
                        </v-alert>

                        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" density="compact">
                            {{ errorMessage }}
                        </v-alert>

                        <v-form @submit.prevent="saveProfile">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-model="formData.fullName" label="Full Name" variant="outlined"
                                        :readonly="!isEditing" density="comfortable" bg-color="surface"
                                        class="profile-field" prepend-inner-icon="mdi-account"></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field v-model="formData.email" label="Email" variant="outlined" readonly
                                        density="comfortable" bg-color="surface" class="profile-field"
                                        prepend-inner-icon="mdi-email"></v-text-field>
                                </v-col>

                                <v-col cols="12" v-if="isEditing">
                                    <div class="d-flex justify-end">
                                        <v-btn variant="outlined" color="grey" class="mr-2" @click="cancelEdit">
                                            Cancel
                                        </v-btn>
                                        <v-btn color="primary" variant="elevated" @click="saveProfile"
                                            :loading="isSaving">
                                            Save Changes
                                        </v-btn>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>

                <v-card class="profile-card mt-4" elevation="2" rounded="lg">
                    <v-card-title class="pa-6">
                        <span class="text-h5">Account Settings</span>
                    </v-card-title>

                    <v-card-text class="pa-6 pt-2">
                        <v-list>
                            <v-list-item prepend-icon="mdi-logout" title="Logout" subtitle="Sign out from your account" router-link to="/Login"
                                class="logout-item" @click="userStore.logout"></v-list-item>

                                
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.profile-container {
    background-color: #f5f5f5;
    min-height: 100vh;
}

.profile-card {
    border-radius: 16px;
    overflow: hidden;
    background-color: white;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.profile-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.profile-field {
    border-radius: 8px;
    transition: all 0.2s ease;
}

.logout-item {
    border-radius: 8px;
    transition: background-color 0.2s ease;
}

.logout-item:hover {
    background-color: rgba(244, 67, 54, 0.1) !important;
}
</style>
