class NewsApp{
    constructor(){
        this.apiKey = "test";
        this.newsArticle = [];
        this.serachString = '';
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalPages = 0;
    }

    setSearchString(searchString){
        this.serachString = searchString;
    }

    async getAllNewsArticles(){
        const Url = `http://content.guardianapis.com/search?api-key=${this.apiKey}&q=${encodeURIComponent(this.searchString)}&show-fields=thumbnail,headline&show-tags=keyword&page=${this.currentPage}&page-size=${this.pageSize}`;
        try{
            const response = await fetch(Url);
            const resData = await response.json();
            this.newsArticle = resData.response.results;
            this.totalPages = Math.ceil(resData.response.total / this.pageSize);
        }
        catch(error){
            errorDiv.innerHTML = "Error Fetching in article";
        }
    }

    renderNewsArticles(){
        const newsResult = document.getElementById("news-container");
        newsResult.innerHTML = "";

        //If no result found
        if(this.newsArticle.length < 0){
            newsResult.innerHTML = "No Result Found";
            return;
        }
        console.log(this.newsArticle);
        //If Data is there
        for (const newArticle of this.newsArticle) {
            console.log("newArticle");
            const aticleContainer = document.createElement("div");
            aticleContainer.classList.add("article");

            //Img div
            const imgDiv = document.createElement("div");
            imgDiv.classList.add("img-div");
            const thumbnailLink  = document.createElement("a");
            const webUrl    =  newArticle.webUrl;
            thumbnailLink.href   = webUrl;
            const thumbnailImage = document.createElement("img");
            const thumbnail      =  newArticle.fields.thumbnail || "default.jpg";
            thumbnailImage.src   = thumbnail;
            thumbnailLink.appendChild(thumbnailImage);
            imgDiv.appendChild(thumbnailLink);

            //heading & tag div

            const infoDiv = document.createElement("div");
            infoDiv.classList.add("infoDiv");
            const heading   =  newArticle.fields.headline;
            const headingLink =  document.createElement("a");
            headingLink.href  = webUrl;
            headingLink.textContent = heading;
            infoDiv.appendChild(headingLink);

            aticleContainer.appendChild(imgDiv);
            aticleContainer.appendChild(infoDiv);

            const keywordDiv = document.createElement("div");
            keywordDiv.classList.add("keywordDiv");

            for(const tags of newArticle.tags){
                const keywordLink = document.createElement("button");
                keywordLink.classList.add("keywords");
                keywordLink.style.cursor = "pointer";
                keywordLink.textContent = tags.webTitle;
                keywordLink.addEventListener('click', () => {
                    this.setSearchString(tags.webTitle);
                    this.currentPage = 1;
                    this.getAllNewsArticles();
                    this.renderNewsArticles();
                });
                keywordDiv.appendChild(keywordLink);
            }
            infoDiv.appendChild(keywordDiv);
            newsResult.appendChild(aticleContainer); 
        }
        if(this.newsArticle)
            this.renderPagination();
    }

    renderPagination() {
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Prev';

        prevButton.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.getAllNewsArticles();
                this.renderNewsArticles();
            }
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';

        nextButton.addEventListener('click',()=>{
            if(this.currentPage < this.totalPages){
                this.currentPage++;
                this.getAllNewsArticles();
                this.renderNewsArticles();
            }
        });

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;

        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(pageInfo);
        paginationContainer.appendChild(nextButton);
    }
}

const searchForm = document.getElementById("search-form");
const newsApp = new NewsApp();
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const inputValue = document.getElementById("search-input").value;
    if(inputValue == ""){
        errorDiv.innerHTML = "Please enter the search text";
    }else{
        newsApp.setSearchString(inputValue);
        newsApp.getAllNewsArticles();
        newsApp.renderNewsArticles();
    }
});

