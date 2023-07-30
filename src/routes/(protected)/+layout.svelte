<script>
  import { enhance } from '$app/forms';
</script>

<header><form method="post" action="?/logout" use:enhance><button>Logout</button></form></header>
<slot />
