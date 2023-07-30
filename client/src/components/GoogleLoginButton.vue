<template>
  <a href="/api/auth/google" class="google">
    <v-icon size="small" icon="mdi-google" />
    <div>Log in with Google</div>
  </a>
</template>

<script></script>

<style scoped>
.google {
  width: 300px;
  padding: 12px;
  border-radius: 4px;
  margin: 5px 0;
  font-size: 17px;
  background-color: white;
  color: #757575;
  display: flex;
  gap: 50px;
  font-family: 'Handlee', cursive;
  font-weight: bold;
}

.google:hover {
  background-color: #3d8994;
  border-color: #3d8994;
  color: white;
}

@media (max-width: 768px) {
  .google {
    width: 160px;
    padding: 6px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    background-color: white;
    color: #757575;
    border-radius: 3px;
    display: flex;
    gap: 20px;
    font-family: 'Handlee', cursive;
    font-weight: bold;
  }

  .google:hover {
    background-color: #3d8994;
    border-color: #3d8994;
    color: white;
  }
}
</style>
