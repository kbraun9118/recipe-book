<script lang="ts">
  interface Props {
    text: string[] | undefined;
    fieldName: string;
  }

  let { text, fieldName }: Props = $props();
</script>

{#if text}
  <p class="text-xs text-error-500 first-letter:capitalize">
    {text?.map((s) => s.replace('Number', fieldName).replace('String', fieldName).replace('Array', fieldName))}
  </p>
{/if}
