<template>
  <div id="app">
    <section>
      <img
        alt="Vue logo"
        class="logo"
        src="https://www.vuepeople.org/_nuxt/img/logo-vuepeople.26e761f.svg"
      />
    </section>
    <section>
      <div>
        <h2>Top Ten Tags</h2>
        <TagChart :graph-data="tags.slice(0, 10)" />
      </div>
    </section>

    <section v-for="s in sections" :key="s">
      <div>
        <h2>{{ s }}</h2>
        <TagChart :graph-data="tags" :subsets="subsets[s]" />
      </div>
    </section>

    <section>
      <div>
        <h2>VueVixens</h2>
        <ul>
          <li>https://vuevixens.org/</li>
          <li>
            Vue Vixens are foxy people who identify as women <br />
            and who want to learn Vue.js to make websites and mobile apps
          </li>
          <li>
            Self-driven code labs completed in a workshop format in groups with
            mentoring
          </li>
          <li>info@vuevixens.org</li>
        </ul>
      </div>
    </section>

    <section v-if="countriesCount">
      <div>
        <h2>Country Distribution</h2>
        <TagChart :graph-data="countriesCount" />
      </div>
    </section>

    <section>
      <div>
        <h2>Free Search</h2>
        <input v-model.lazy="search" />
        <TagChart
          v-if="searched.length > 0"
          :graph-data="tags"
          :subsets="searched"
        />
      </div>
    </section>
    <section>
      <div>
        <h2>
          9 months<br />
          <span>of</span> VuePeople
        </h2>
        <ul>
          <li>Map data visualisation is.. Not trivial!</li>
          <li>It grew!</li>
          <li>At some point it was.. slow!</li>
          <li>Libraries, they are amazing but...</li>
          <li>Few lines of code may do... all the difference</li>
        </ul>
      </div>
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
html,
body {
  margin: 0;
  padding: 0;
}

#app {
  width: 100vw;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #35495e;
  background-color: #f0f3f6;
}

.logo {
  width: 500px;
}

h2 {
  margin: 0 0 20px;
  font-size: 48px;
  line-height: 1;
  text-transform: capitalize;
  letter-spacing: -1px;
}

h2 span {
  text-transform: none;
}

section {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

section > div {
  width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.075);
}

section canvas {
  width: 640px;
  height: 480px;
}

section input {
  width: 35%;
  margin: 0 0 20px;
  padding: 5px 10px;
  font-size: 24px;
  text-align: center;
  border: 1px solid #a6b0ba;
  border-radius: 100px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: #35495e;
  outline: none;
}

section ul {
  margin: 20px;
  padding: 0;
}

section ul li {
  position: relative;
  margin-bottom: 10px;
  padding-left: 36px;
  font-size: 28px;
  text-align: left;
  list-style-type: none;
}

section ul li::before {
  content: "✱";
  position: absolute;
  top: 0;
  left: 0;
  color: #4eba87;
}

section:first-of-type {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  background-color: #ffffff;
}
</style>
