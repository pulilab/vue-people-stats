<script>
import kebabCase from "lodash/kebabCase";
import { Pie } from "vue-chartjs";
import randomColor from "randomcolor";

export default {
  extends: Pie,
  props: {
    graphData: {
      type: Array,
      default: null
    },
    subsets: {
      type: Array,
      default: null
    }
  },
  computed: {
    filteredData() {
      return this.subsets ? this.filterBySubset() : this.graphData;
    },
    colors() {
      return randomColor({ count: this.filteredData.length });
    },
    chartData() {
      const data = [];
      const labels = [];
      const backgroundColor = [];
      this.filteredData.forEach(gd => {
        data.push(gd.people);
        labels.push(gd.name);
        backgroundColor.push(this.officiallyRandomColors(gd.name));
      });
      return {
        datasets: [
          {
            data,
            backgroundColor
          }
        ],
        labels
      };
    }
  },
  watch: {
    chartData: {
      deep: true,
      immediate: false,
      handler() {
        this.renderChart(this.chartData, this._options);
      }
    }
  },
  mounted() {
    this._options = {
      responsive: true,
      maintainAspectRatio: false
    };
    this.renderChart(this.chartData, this._options);
  },
  methods: {
    officiallyRandomColors(name) {
      switch (name) {
        case "vue": {
          return "#42b883";
        }
        case "vuevixens": {
          return "#ed7251";
        }
        default: {
          return this.colors.pop();
        }
      }
    },
    filterBySubset() {
      const finalTags = [];
      const parsed = this.subsets.reduce((a, c) => {
        if (c instanceof Array) {
          const inner = { people: 0 };
          c.forEach(innerTag => {
            a[innerTag.toLowerCase()] = inner;
          });
          finalTags.push(c[0].toLowerCase());
        } else {
          a[c.toLowerCase()] = { people: 0 };
          finalTags.push(c.toLowerCase());
        }
        return a;
      }, {});
      this.graphData.forEach(d => {
        const parsed_name = kebabCase(d.name);
        if (parsed[parsed_name] !== undefined) {
          parsed[parsed_name].people += d.people;
        }
      });
      return finalTags.map(f => ({ name: f, people: parsed[f].people }));
    }
  }
};
</script>

<style></style>
