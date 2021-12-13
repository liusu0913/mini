<template>
  <div
    v-if="errors.length > 0"
    class="uni-error-field"
  >
    <div
      v-for="(err,index) in errors"
      :key="index"
    >
      {{ err.message }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errors: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="scss">
    .uni-error-field {
        color: red;
    }
</style>
