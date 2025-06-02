<script lang="ts">
    interface Props {
        size?: 'small' | 'medium' | 'large';
        message?: string;
    }

    let { size = 'medium', message = '' }: Props = $props();

    const sizeClasses = {
        small: 'w-8 h-8',
        medium: 'w-12 h-12',
        large: 'w-16 h-16'
    };
</script>

<div class="flex flex-col items-center justify-center gap-4">
    <div class="relative {sizeClasses[size]}">
        <!-- Outer ring -->
        <div class="absolute inset-0 rounded-full border-4 border-white/20"></div>
        <!-- Spinning ring -->
        <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"></div>
        <!-- Inner planet -->
        <div class="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 animate-pulse"></div>
    </div>
    
    {#if message}
        <p class="text-white/80 text-sm animate-pulse">{message}</p>
    {/if}
</div>

<style>
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    .animate-spin {
        animation: spin 1s linear infinite;
    }
</style>