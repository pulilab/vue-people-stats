<template>
  <div id="app">
    <img
      alt="Vue logo"
      class="logo"
      src="https://www.vuepeople.org/_nuxt/img/logo-vuepeople.26e761f.svg"
    />
    <section>
      <h2>Top Ten</h2>
      <TagChart :graph-data="tags.slice(0, 10)" />
    </section>

    <section v-for="s in sections" :key="s">
      <h2>{{ s }}</h2>
      <TagChart :graph-data="tags" :subsets="subsets[s]" />
    </section>
  </div>
</template>

<script>
import tags from "./assets/tags.json";
import subsets from "./assets/subsets.json";
import TagChart from "./components/TagChart.vue";

export default {
  name: "app",
  components: {
    TagChart
  },
  data() {
    return {
      tags,
      subsets
    };
  },
  computed: {
    sections() {
      return Object.keys(this.subsets);
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.logo {
  width: 500px;
}

h2 {
  text-transform: capitalize;
}

section {
  width: 40%;
  margin: auto;
}
</style>
