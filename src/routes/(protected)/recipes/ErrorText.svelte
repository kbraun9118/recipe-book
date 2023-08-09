<script lang="ts">
  export let text: string[] | undefined;
  export let fieldName: string;
</script>

{#if text}
  <p class="text-xs text-error-500 first-letter:capitalize">
    {text?.map((s) => s.replace('Number', fieldName).replace('String', fieldName))}
  </p>
{/if}
