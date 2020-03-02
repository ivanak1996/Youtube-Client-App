
  async function getSearchResultsFromApi(keyword: string) {
    try {
      let response = await fetch(
        `https://localhost:44396/api/Youtube/GetVideosByKeyword/${keyword}`,
      );
      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }
