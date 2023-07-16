<template>
  <a href="/api/auth/facebook" class="facebook">
    <v-icon size="small" icon="mdi-facebook" />
    <div>Log in with Facebook</div>
  </a>
</template>

<script></script>

<style scoped>
.facebook {
  width: 300px;
  padding: 12px;
  border: none;
  border-radius: 4px;
  margin: 5px 0;
  opacity: 0.85;
  display: inline-block;
  font-size: 17px;
  line-height: 20px;
  text-decoration: none; /* remove underline from anchors */
  background-color: white;
  color: #757575;
  border: solid;
  border-color: #f7f5f5;
  border-radius: 3px;
  display: flex;
  gap: 50px;
  font-family: 'Handlee', cursive;
  font-weight: bold;
}

.facebook:hover {
  background-color: #3d8994;
  border-color: #3d8994;
  color: white;
}
</style>
