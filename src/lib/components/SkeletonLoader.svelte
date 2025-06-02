<script lang="ts">
    interface Props {
        type?: 'text' | 'card' | 'avatar' | 'button';
        width?: string;
        height?: string;
        count?: number;
    }

    let { type = 'text', width = 'w-full', height = 'h-4', count = 1 }: Props = $props();

    const types = {
        text: 'rounded',
        card: 'rounded-lg h-32',
        avatar: 'rounded-full w-12 h-12',
        button: 'rounded-lg h-10'
    };
</script>

<div class="space-y-2">
    {#each Array(count) as _, i}
        <div 
            class="bg-white/10 animate-shimmer {width} {types[type] || ''} {type !== 'avatar' ? height : ''}"
        ></div>
    {/each}
</div>

<style>
    @keyframes shimmer {
        0% {
            background: linear-gradient(90deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.2) 50%, 
                rgba(255, 255, 255, 0.1) 100%
            );
            background-size: 200% 100%;
            background-position: -200% center;
        }
        100% {
            background-position: 200% center;
        }
    }
    
    .animate-shimmer {
        animation: shimmer 2s ease-in-out infinite;
        background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.2) 50%, 
            rgba(255, 255, 255, 0.1) 100%
        );
        background-size: 200% 100%;
    }
</style>