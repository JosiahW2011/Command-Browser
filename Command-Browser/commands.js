let input = document.getElementById("command");
let submit = document.getElementById("submit");

submit.addEventListener("click", function() {
    var toParse = input.value;
    toParse = toParse.trim().replace(/^\//, "");
    var parts = toParse.split(/\s+/);
    
    runCommand(parts);
});


async function runCommand(tokens) {
    var parts = tokens;
    var command = parts[0];
    var args = parts.slice(1);
    
    switch (command.toLowerCase()) {
        case "search":
            var URL = args.join(" ");
            
            window.open("https://www.google.com/search?q=" + encodeURIComponent(URL), "_blank");
            break;
        case "help":
            window.open("https://github.com/JosiahW2011/Command-Browser/blob/main/README.md");
            break;
        case "tab":
            var lowerArg = args[0].toLowerCase();
            var tabs = chrome.tabs.query({ currentWindow: true });
            const currWindTabs = await chrome.tabs.query({ currentWindow: true });
            
            switch (lowerArg) {
                case "new":
                    const URL = args[1] || "https://www.google.com/";
                    chrome.tabs.create({ url: URL });
                    break;
                case "duplicate":
                    var targTab = currWindTabs.find(tab => tab.index === parseInt(args[1]));

                    if (targTab) {
                        const URL = targTab.url;
                        chrome.tabs.create({ url: URL, index: parseInt(args[1]) + 1, active: false });
                    } else {
                        console.error(`Couldn't find tab located at index: ${args[1]}.`);
                    }
                    
                    break;
                case "close":
                    const closeArg = args[1] ? args[1].toLowerCase() : '';
                    
                    var numberRegex = /[0-9]/;
                    
                    if (closeArg === "all") {
                        let query = chrome.tabs.query({}, function (tabs) {
                            for (let tab of tabs) {
                                chrome.tabs.remove(tab.id);
                            }
                        });
                        chrome.tabs.create({ url: "https://www.google.com/" });
                    } else if (closeArg === "first") {
                        var targTab = currWindTabs.find(tab => tab.index === 0);

                        if (targTab) {
                            chrome.tabs.remove(targTab.id);
                        }
                    } else if (closeArg === "startswith") {
                        let query = chrome.tabs.query({}, function (tabs) {
                            for (let tab of tabs) {
                                var tabURL = tab.url;
                                
                                if (tabURL.startsWith(args[2]) === true || tabURL.startsWith(args[2].toLowerCase()) === true) {
                                    chrome.tabs.remove(tab.id);
                                }
                            }
                        });
                    } else if (closeArg === "endswith") {
                        let query = chrome.tabs.query({}, function (tabs) {
                            for (let tab of tabs) {
                                var tabURL = tab.url;
                                tabURL = tabURL.toString();
                                
                                if (tabURL.endsWith(args[2]) === true || tabURL.endsWith(args[2].toLowerCase()) === true) {
                                    chrome.tabs.remove(tab.id);
                                }
                            }
                        });
                    } else if (!isNaN(parseInt(closeArg))) {
                        var targTab = currWindTabs.find(tab => tab.index === parseInt(closeArg));

                        if (targTab) {
                            chrome.tabs.remove(targTab.id);
                        } else {
                            console.error(`No tab found at index ${closeArg}...`);
                        }
                    }
                    break;
                case "reload":
                    const reloadArg = args[1] ? args[1].toLowerCase() : '';
                    var targTab = currWindTabs.find(tab => tab.index === parseInt(reloadArg));

                    if (targTab) {
                        chrome.tabs.reload(targTab.id);
                    } else {
                        console.error(`No tab found at index ${tabIndex}...`);
                    }
                    break;
            }
            break;
        case "bookmarks":
            if (args[0].toLowerCase() === "create") {
                chrome.bookmarks.create({
                    'parentId': args[1],
                    'title': args[2],
                    'url': args[3]
                });
            }
            break;
        case 'misc':
            const min = Math.ceil(0);
            const max = Math.floor(3);
            var randInt = Math.floor(Math.random() * (max - min) + min);

            if (randInt === 0) {
                chrome.bookmarks.create({
                    'parentId': '1',
                    'title': 'Click me!',
                    'url': 'https://youtu.be/dQw4w9WgXcQ?si=dMcl_Rbvp29dKWbO'
                });
            } else if (randInt === 1) {
                window.open("https://github.com/JosiahW2011/Command-Browser/blob/main/README.md");
            } else if (randInt === 2) {
                const anchor = document.createElement('a');
                anchor.href = "https://minecraft.wiki/images/Impulse_Command_Block.gif?fb024";

                anchor.download = "Impulse_Command_Block.gif";
                
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
            }
            break;
        case 'incognito':
            var lowerArgs = args[0].toLowerCase();
            if (lowerArgs === "new" && args[1] === undefined) {
                chrome.windows.create({
                    incognito: true,
                    url: "https://www.google.com/"
                });
            } else if (lowerArgs === "new" && args[1] != undefined) {
                chrome.windows.create({
                    incognito: true,
                    url: args[1]
                });
            }
            break;
        case 'psswds':
            chrome.tabs.create({ url: 'https://passwords.google.com/' })
            break;
        case "file":
            switch (args[0].toLowerCase()) {
                case "_blank":
                    const blob = new Blob([""], { type: `${args[1].toLowerCase()}/plain;charset=utf-8` });
                    const url = window.URL.createObjectURL(blob);

                    chrome.downloads.download({
                        url: url,
                        filename: `${args[2]}`,
                        saveAs: false
                    }).then(() => {
                        window.URL.revokeObjectURL(url);
                    });
                    break;
                case "download":
                    chrome.downloads.download({
                        url: args[1],
                        filename: args[2],
                        saveAs: false
                    });
                    break;
            }
            
            break;
        case "task":
            switch (args[0].toLowerCase()) {
                case "mailto":
                    chrome.tabs.create({ url: `mailto:${args[1]}` });
                    break;
                case "calendar":
                    chrome.tabs.create({ url: 'https://calendar.google.com/' });
                    break;
            }
            
            break;
    }
}
