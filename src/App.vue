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

    <section v-if="countriesCount">
      <h2>Country Distribution</h2>
      <TagChart :graph-data="countriesCount" />
    </section>

    <section>
      <h2>Free Search</h2>
      <input v-model.lazy="search" />
      <TagChart
        v-if="searched.length > 0"
        :graph-data="tags"
        :subsets="searched"
      />
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { inBounds } from "./utils.js";
import tags from "./assets/tags.json";
import subsets from "./assets/subsets.json";
import boundaries from "./assets/boundaries.json";
import TagChart from "./components/TagChart.vue";

export default {
  name: "app",
  components: {
    TagChart
  },
  data() {
    return {
      tags,
      subsets,
      boundaries,
      people: null,
      search: null
    };
  },
  computed: {
    sections() {
      return Object.keys(this.subsets);
    },
    countriesCount() {
      if (this.people) {
        const result = [];
        const countries = this.boundaries.reduce((a, c) => {
          const inner = { name: c.name, people: 0 };
          a[c.name] = inner;
          result.push(inner);
          return a;
        }, {});
        this.people.forEach(p => {
          const latLng = {
            lat: p.location.coordinates[0],
            lng: p.location.coordinates[1]
          };
          for (const country of boundaries) {
            if (inBounds(latLng, country)) {
              countries[country.name].people += 1;
              return;
            }
          }
        });
        return result
          .filter(r => r.people)
          .sort((a, b) => b.people - a.people)
          .slice(0, 20);
      }
      return undefined;
    },
    searched() {
      if (this.search) {
        return this.search.split(",");
      }
      return [];
    }
  },
  mounted() {
    this.loadPeople();
  },
  methods: {
    async loadPeople() {
      const { data } = await axios.get("/api/people/");
      this.people = data;
    }
  }
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
