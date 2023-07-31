<script>
  import { enhance } from '$app/forms';
</script>

<header>
  <h1>Recipe Book</h1>
  <nav>
    <a href="/new">Add Recipe</a>
    <form method="post" action="?/logout" use:enhance><button>Logout</button></form>
  </nav>
</header>
<slot />
