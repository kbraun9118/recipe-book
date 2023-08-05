<script lang="ts">
  export let text: string[] | undefined;
  export let fieldName: string;

  const displayName = fieldName[0].toUpperCase() + fieldName.slice(1);
</script>

{#if text}
  <p class="text-xs text-error-500">
    {text?.map((s) => s.replace('Number', displayName).replace('String', displayName))}
  </p>
{/if}
