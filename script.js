
let loading_animation = document.getElementById('loading_animation');

$(window).on('load', function () {
    $('#loading_animation').hide();
})
displayQuote()
displayRecentWord();
displaybookmarkedWord();
/**********FETCH API************/

// API for QUOTE
let quote = document.getElementById('quote');
let author = document.getElementById('author');
// console.log('api fetching')
async function displayQuote() {
    console.log('inside')
  try {
    let quoteNum = Math.floor(Math.floor(Math.random() * 17));
    console.log(quoteNum)
    console.log('api fetch')
    const response = await fetch("https://type.fit/api/quotes");
    console.log(response)
    const data = await response.json();

    if (response.ok) {
      // Update DOM elements
      quote.innerHTML = `"${data[quoteNum].text}"`;
      author.innerHTML = `~${data[quoteNum].author}`;
      console.log('updated')
    } else {
      throw new Error(`Failed to fetch quotes. Status: ${response.status}`);
    }
  } catch (error) {
    // Log the error
    console.log('inside error')
    console.error("Error:", error);

    // Fallback to another API or provide a default quote
    fetch("https://api.quotable.io/random") // Use HTTPS
      .then(res => res.json())
      .then(data => {
        quote.innerHTML = `"${data.content}"`;
        author.innerHTML = `~${data.author}`;
      })
      .catch(fallbackError => {
        console.error("Fallback Error:", fallbackError);
        // Provide a default quote or handle it as needed
      });
  }
}


/**RESIZING INPUT TEXTAREA */

/********** *****/
let search_word = document.getElementById('search_word');
let card_title = document.getElementById('card_title');
let word_meaning = document.getElementById('word_meaning');
let word_example = document.getElementById('word_example');
let word_pronounciation = document.getElementById('word_pronounciation');
let word_audio_source = document.getElementById('word_audio_source');
let word_audio = document.getElementById('word_audio');
let audio_btn = document.getElementById('audio_btn');
let search_btn = document.getElementById('search_btn');
let bookmark_btn = document.getElementById('bookmark_btn');
let offcanvasRight = document.getElementById('offcanvasRight');
let word_history_section = document.getElementById('word_history_section');

let word_result_div = document.getElementById('word_result_div');

search_btn.addEventListener('click', async function () {
    bookmark_icon.getElementsByTagName("i")[0].className = "bi bi-bookmark";
    let show_result = document.getElementById('show_result');
    show_result.style.display = "none";
    if (search_word.value == "") {
        show_result.style.display = "none";
        var toastLiveExample = document.getElementById('liveToast')
        var toast = new bootstrap.Toast(toastLiveExample);
        toast.show()
    }
    else {
        fetchWord();
        word_history_section.style.display = "none";
        loading_animation.style.display = "block";

        setTimeout(function () {
            loading_animation.style.display = "none";
            word_history_section.style.display = "block";
        }, 990)
        setTimeout(function () {
            show_result.style.display = "block";

        }, 1000)


    }/***local storage for recently searched  words  */
    let recently_searched = localStorage.getItem("recently_searched");
    if (recently_searched == null) {
        recentWord = [];
    } else {
        recentWord = JSON.parse(recently_searched);

    }
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search_word.value}`)
    const data = await response.json();

    let recentObj = {
        title: `${data[0].word}`,
        meaning: `${data[0].meanings[0].definitions[0].definition}`,
    }

    if (search_word.value != "") {
        recentWord.push(recentObj);
        localStorage.setItem("recently_searched", JSON.stringify(recentWord));
        displayRecentWord();
    }

})
reset_btn.addEventListener('click', function () {
    search_word.value = "";
    show_result.style.display = "none";
})
// API for WORD
async function fetchWord() {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search_word.value}`)
    const data = await response.json();
    if (response.ok) {
        audio_btn.style.display = "block";
        bookmark_icon.style.display = "block";

        card_title.innerHTML = `${data[0].word}`
        word_meaning.innerHTML = `<br>  <b><i>Meaning: </i></b>  ${data[0].meanings[0].definitions[0].definition} `
        word_example.innerHTML = `<b><i>Example: </i></b>   ${data[0].meanings[0].definitions[0].example} `
        word_audio_source.src = `${data[0].phonetics[0].audio}`
        word_pronounciation.innerHTML = `<b><i>Pronounciation:</i></b>  ${data[0].phonetics[0].text}  `

    }
    else {
        card_title.innerHTML = `${data.title}`
        word_meaning.innerHTML = `${data.message}`
        word_example.innerHTML = `${data.resolution}`
        word_pronounciation.innerHTML = "";
        audio_btn.style.display = "none";
        bookmark_icon.style.display = "none";

    }
}
//word_audio
audio_btn.addEventListener('click', function (e) {
    e.preventDefault();
    audio_btn.getElementsByTagName("i")[0].className = "bi bi-volume-down-fill";
    word_audio.load(); //call this to just preload the audio without playing
    word_audio.play();
    word_audio.addEventListener('ended', function () {

        audio_btn.getElementsByTagName("i")[0].className = "bi bi-volume-down";
        console.log(audio_btn.getElementsByTagName("i")[0].className)


    })


})
//Recently searched
function displayRecentWord() {
    // console.log('displayRecentWord() called ');
    let recently_searched = localStorage.getItem("recently_searched");
    if (recently_searched == null) {
        // console.log("recentWord was null")
        recentWord = [];
    } else {
        recentWord = JSON.parse(recently_searched);
        // console.log("recentWord was not null")
    }
    let html = "";
    recentWord.forEach(function (element, index) {
        // console.log("entered recentWord loop  fnc")
        html += `<div class="recent_word my-2 mx-2 card" style="width: 20rem;">
        <div class="card-body">
           <button id ="recent_popover" type="button" class="btn " data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-placement="bottom" title="${element.title}"
            data-bs-content="${element.meaning}"> <h5 class="card-title">${element.title}</h5>
        </button>
            </div>
    </div>`;
        deleteRecentSearch(index);
        //console.log(html);
    });
    let recently_searched_element = document.getElementById('recently_searched')
    let recent_search_title = document.getElementById("recent_search_title");
    if (recentWord.length != 0) {
        recent_search_title.style.display = "block"
        recently_searched_element.innerHTML = html;
    }

}
function deleteRecentSearch(index) {
    //console.log(`index ${index} given`)
    let recently_searched = localStorage.getItem("recently_searched");
    if (recently_searched == null) {

        recentWord = [];
    } else {
        recentWord = JSON.parse(recently_searched);
    }
    if (index == 4) {
        recentWord.splice(0, 1);
        localStorage.setItem("recently_searched", JSON.stringify(recentWord));
        displayRecentWord();

    }
}
//bookmark
let bookmark_icon = document.getElementById('bookmark_icon')
bookmark_icon.addEventListener('click', function () {

    let bookmark_icon_class = bookmark_icon.getElementsByTagName("i")[0].className
    /***local storage for bookmarked words  */
    let bookmarked_words = localStorage.getItem("bookmarked_words");
    if (bookmarked_words == null) {
        bookmarkedObj = [];
    } else {
        bookmarkedObj = JSON.parse(bookmarked_words);

    }
    if (bookmark_icon_class == "bi bi-bookmark") {

        bookmark_icon.getElementsByTagName("i")[0].className = "bi bi-bookmark-check-fill";
        // to be reviewed such that if class name == icon fil then
        let bookmark_parent = this.parentElement;

        bookmarkedObj.push(bookmark_parent.getElementsByTagName("h5")[0].innerHTML);// to be changed to 
        localStorage.setItem("bookmarked_words", JSON.stringify(bookmarkedObj));
        displaybookmarkedWord();

    }
    else {
        bookmark_icon.getElementsByTagName("i")[0].className = "bi bi-bookmark";
        bookmarkedObj

    }





})
function displaybookmarkedWord() {
    let bookmarked_words = localStorage.getItem("bookmarked_words");
    if (bookmarked_words == null) {
        bookmarkedObj = [];
    } else {
        bookmarkedObj = JSON.parse(bookmarked_words);

    }
    let html = "";
    bookmarkedObj.forEach(function (element, index) {
        html += `<li id=${index}><h4>${element}<button id=${index} type="button" class="btn-close text-reset"
        aria-label="Close" onclick="delete_bookmarkWord(this.id)"></button></h4></li><br>`;
        console.log(`index :${index} passed to delete function`)
    });
    let bookmarked_words_element = document.getElementById('bookmarked_words_element')
    if (bookmarkedObj.length != 0) {

        bookmarked_words_element.innerHTML = html;

    }
    else {
        bookmarked_words_element.innerHTML = `<h5>No words bookmarked !!</h5>`
    }
}
function delete_bookmarkWord(index) {
    let bookmarked_words = localStorage.getItem("bookmarked_words");
    if (bookmarked_words == null) {
        bookmarkedObj = [];
    } else {
        bookmarkedObj = JSON.parse(bookmarked_words);

    }
    console.log(`index :${index} received inside delete function`)
    bookmarkedObj.splice(index, 1);
    console.log(`index :${index} deleted`)
    localStorage.setItem("bookmarked_words", JSON.stringify(bookmarkedObj));
    displaybookmarkedWord();
}


var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})


let mybutton = document.getElementById("btn-back-to-top");

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}
mybutton.addEventListener("click", backToTop);

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}