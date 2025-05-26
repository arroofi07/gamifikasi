<script lang="ts">
    import {db} from "../firebase";
    import { collection, addDoc } from "firebase/firestore";
    import { goto } from '$app/navigation';
    
    let username = "";

    const createUser = async () => {
        try {
            const usersRef = collection(db, "users");
            const docRef = await addDoc(usersRef, {
                username: username,
                createdAt: new Date(),
            });
            
            // Store user data with expiration
            const userData = {
                id: docRef.id,
                username: username,
                expiry: new Date().getTime() + (60 * 60 * 1000) // 1 hour in milliseconds
                // expiry: new Date().getTime() + (30 * 1000) // 30 second in milliseconds
            };
            
            localStorage.setItem("userData", JSON.stringify(userData));
            
            await goto('/home');
            username = "";
        } catch (error) {
            console.error("Error creating user: ", error);
        }
    }
</script>

<div 
    class="md:hidden min-h-screen bg-blue-100 flex justify-center items-center"
    >

    <!-- form login -->
    <div class="grid grid-cols-1 bg-rose-200 gap-4 p-4 rounded-lg shadow-md w-80">

        <div>
            <label for="username">Username</label>
            <input 
                type="text" 
                id="username" 
                bind:value={username}
                class="w-full p-2 border border-gray-300 rounded" 
                placeholder="Masukkan username"
            >
        </div>

        <button 
            class="hover:bg-amber-400 bg-blue-500 text-white px-4 py-2 rounded transition"
            on:click={createUser}
        > 
            Create User
        </button>
    </div>
</div>

<!-- Desktop Warning Message -->
<div class="hidden md:flex min-h-screen bg-blue-200 text-black items-center justify-center desktop-warning">
<div class="text-center p-8 warning-card">
        <div class="text-6xl mb-4">🌌</div>
        <h1 class="text-3xl font-bold mb-4">Eksplorasi Mobile</h1>
        <p class="text-lg opacity-90 mb-4">
            Pengalaman tata surya ini dirancang khusus untuk perangkat mobile
        </p>
        <p class="text-sm opacity-75">
            Silakan buka di smartphone atau tablet untuk menjelajahi planet-planet
        </p>
    </div>
</div>
