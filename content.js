chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "GET_JD_TEXT") {

        let pageText = document.body.innerText;

        sendResponse({
            jdText: pageText
        });
    }

    return true;
});
