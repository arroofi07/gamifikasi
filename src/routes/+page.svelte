<script lang="ts">
    import spaceImage from '$lib/assets/space.png';
    import sunImage from '$lib/assets/sun.png';
    import mercuryImage from '$lib/assets/mercury.png';
    import venusImage from '$lib/assets/venus.png';
    import earthImage from '$lib/assets/earth.png';
    import mars from '$lib/assets/mars.png';
    import jupiter from '$lib/assets/jupiter.png';
    import saturnus from '$lib/assets/saturnus.png';
    import uranus from '$lib/assets/uranus.png';
    import neptune from '$lib/assets/neptune.png';

    const planets = [
        {
            image: sunImage,
            width: 300,
            height: 300,
        },
        {
            image: mercuryImage,
            width: 70,
            height: 70,
            position: "ml-42"

        },
        {
            image: venusImage,
            width: 80,
            height: 80,
                position: "mr-52"
        },
        {
            image: earthImage,
            width: 80,
            height: 80,
            position: "ml-10"
        },
        {
          image:mars,
          width: 80,
          height: 80,
          position: "ml-52"
        },
        {
          Image:jupiter,
          width: 80,
          height: 80,
          position: "ml-52"
        },
        {
          image:saturnus,
          width: 80,
          height: 80,
          position: "ml-52"
        },
        {
          image:uranus,
          width: 80,
          height: 80,
          position: "ml-52"
        },
        {
          image:neptune,
          width: 80,
          height: 80,
          position: "ml-52"
        }

    ];
</script>

<!-- Mobile Only Content -->
<div 
    id="bg-img" 
    class="md:hidden container text-white "
    style="background-image: url({spaceImage}); background-size: cover; background-position: center; min-height: 100vh;">

    <div class="gap-14 grid-cols-1  grid justify-items-center   items-end ">
        {#each planets as planet}
            <div class="{planet.position} mb-10 ">
                <img 
                    src={planet.image} 
                    width={planet.width} 
                    height={planet.height} 
                    alt="planet"
                />
            </div>
        {/each}
    </div>
</div>

<!-- Desktop Warning Message -->
<div class="hidden md:flex min-h-screen items-center justify-center bg-gray-100">
  <div class="text-center p-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">⚠️ Mobile Only</h1>
    <p class="text-gray-600">Website ini hanya dapat diakses melalui perangkat mobile.</p>
  </div>
</div>



