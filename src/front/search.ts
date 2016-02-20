/// <reference path="../../typings/main.d.ts" />
"use strict";
import Vue = require("vue");
import * as request from "superagent";

const baseUrl =
  function() {
    let u = window.location.href.split("/");
    u.pop();
    return u.join("/");
  }();

function boolToStatus(value: boolean): string {
  return value ? "enabled" : "disabled";
}

function validate(query: string): boolean {
  return Boolean(query);
}

function search(query: string, strict: boolean, similarity: boolean) {
  return request
    .get(baseUrl + "/api/search")
    .query({
      query,
      strict: boolToStatus(strict),
      similarity: boolToStatus(similarity)
    });
}

let app = new Vue({
  el: "#app",
  data: {
    query: undefined,
    strict: true,
    similarity: false,
    hide_progress: true,
    search_results: []
  },
  computed: {
    invalid: function(): boolean {
      return ! validate(this.query);
    },
    valid: function(): boolean {
      return validate(this.query);
    },
  },
  methods: {
    search: function() {
      if (! this.hide_progress) {
        return;
      } else if (validate(this.query)) {
        this.hide_progress = false;
        search(this.query, this.strict, this.similarity)
          .end((err, res) => {
            if (err || !res.ok) {
            } else {
              this.search_results = JSON.parse(res.text).values;
            }
            this.hide_progress = true;
          });
      }
    }
  }
});
