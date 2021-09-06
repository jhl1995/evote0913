<template>
  <div class="posts">
    <h1>시흥시 주민참여 예산 투표</h1>
    <input type="radio" id="one" value="Democrat" v-model="picked">
    <label for="one">찬성</label>
    <br>
    <input type="radio" id="two" value="Green" v-model="picked">
    <label for="two">반대</label>
    <br>
    
    <br>
    <br>
    <form v-on:submit="castBallot">
      <input type="text" v-model="input.voterId" placeholder="투표자 아이디 입력">
      <br>
      <input type="submit" value="투표">
      <br>
    </form>
    <br>
    <span v-if="response">
      <b>{{ response }}</b>
    </span>
    <br>
    <vue-instant-loading-spinner id="loader" ref="Spinner"></vue-instant-loading-spinner>
  </div>
</template>

<script>
import PostsService from "@/services/apiService";
import VueInstantLoadingSpinner from "vue-instant-loading-spinner/src/components/VueInstantLoadingSpinner.vue";

export default {
  name: "response",
  data() {
    return {
      input: {},
      picked: null,
      response: null
    };
  },
  components: {
    VueInstantLoadingSpinner
  },
  methods: {
    async castBallot() {
      await this.runSpinner();

      const electionRes = await PostsService.queryWithQueryString('election');

      let electionId = electionRes.data[0].Key;

      console.log("picked: ");
      console.log(this.picked);
      console.log("voterId: ");
      console.log(this.input.voterId);
      this.response = null;

       //error checking for making sure to vote for a valid party
      if (this.picked === null ) {
        console.log('this.picked === null')

        let response = "투표할 항목을 선택하지 않으셨습니다!";
        this.response = response;
        await this.hideSpinner();
      
      } else if (this.input.voterId === undefined) {
        console.log('this.voterId === undefined')

        let response = "투표자를 입력하지 안으셨습니다!";
        this.response = response;
        await this.hideSpinner();

      } else {

        const apiResponse = await PostsService.castBallot(
          electionId,
          this.input.voterId,
          this.picked
        );

        console.log('apiResponse: &&&&&&&&&&&&&&&&&&&&&&&');
        console.log(apiResponse);

        if (apiResponse.data.error) {
          this.response= apiResponse.data.error;
          await this.hideSpinner();
        } else if (apiResponse.data.message) {
          this.response= `${this.input.voterId} : 등록되지 않은 아이디입니다.`;
          await this.hideSpinner();
        } 
        else {
          let response = `성공적으로 ${apiResponse.data.voterId}의 아이디로 투표가 완료되었습니다. 감사합니다.`;
          this.response = response;

          console.log("투표");
          console.log(this.input);
          await this.hideSpinner();
        }
      }
    },
    async runSpinner() {
      this.$refs.Spinner.show();
    },
    async hideSpinner() {
      this.$refs.Spinner.hide();
    }
  }
};
</script>
