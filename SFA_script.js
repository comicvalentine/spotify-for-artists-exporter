//1.Source of stream 구분 x

//1.1 listeners 
let listenersAll = [...document.querySelectorAll('rect[aria-label]')].map(e => {
    let txt = e.getAttribute("aria-label");
    const m = txt.match(/(.+?), ([\d,]+) Listeners/);
    return { date: m[1], listeners: parseInt(m[2].replace(/,/g,"")) };
});

console.log(listenersAll);


//1.2 streams
let streamsAll = [...document.querySelectorAll('rect[aria-label]')].map(e => {
    let txt = e.getAttribute("aria-label");
    const m = txt.match(/(.+?), ([\d,]+) Streams/);
    return { date: m[1], streams: parseInt(m[2].replace(/,/g,"")) };
});

console.log(streamsAll);


//2.Source of stream 구분 o: Active와 programmed만 (형식: {'date': [...], 'active': [...], 'programmed': [...]}

//2.1 listeners
let listenersActiveProgrammed = [...document.querySelectorAll("rect[aria-label]")].map(e => {
    let txt = e.getAttribute("aria-label").trim();

    let match = txt.match(
        /(.*?)(?: All programmed sources )([\d,]+) listeners, All active sources ([\d,]+) listeners/
    );

    return {
        date: match[1].trim(),
        programmed: parseInt(match[2].replace(/,/g,"")),
        active: parseInt(match[3].replace(/,/g,""))
    };
});

console.log(listenersActiveProgrammed);

//2.2 streams
let streamsActiveProgrammed = [...document.querySelectorAll("rect[aria-label]")].map(e => {
    let txt = e.getAttribute("aria-label").trim();

    let match = txt.match(
        /(.*?)(?: All programmed sources )([\d,]+) streams, All active sources ([\d,]+) streams/
    );

    return {
        date: match[1].trim(),
        programmed: parseInt(match[2].replace(/,/g,"")),
        active: parseInt(match[3].replace(/,/g,""))
    };
});

console.log(streamsActiveProgrammed);

//3.Source of stream 구분 o: 전부 다 (형식:[{'date': Jan, 1, 2023, 'Editorial; 122, ...}])

// 3.1 listeners 
let listenersBySource = [...document.querySelectorAll("rect[aria-label]")].map(e => {
    const txt = e.getAttribute("aria-label").trim();

    // 날짜: Jan 1, 2023 / Jan 1 2023 / January 1,2023 전부 허용
    const dateMatch = txt.match(
        /^([A-Za-z]+)\s+(\d{1,2})(?:,)?\s+(\d{4})/
    );

    const date = dateMatch
        ? `${dateMatch[1]} ${dateMatch[2]}, ${dateMatch[3]}`
        : null;

    // 날짜 부분 제거
    const rest = dateMatch ? txt.slice(dateMatch[0].length).trim() : txt;

    // source 파싱
    const pairs = [...rest.matchAll(/([^,]+?)\s([\d,]+)\slisteners/g)];

    let sources = {};
    for (const [, name, value] of pairs) {
        sources[name.trim()] = parseInt(value.replace(/,/g, ""));
    }

    return {
        date,
        ...sources
    };
});

console.log(listenersBySource);

// 3.2 streams

let streamsBySource = [...document.querySelectorAll("rect[aria-label]")].map(e => {
    const txt = e.getAttribute("aria-label").trim();

    // 날짜: Jan 1, 2023 / Jan 1 2023 / January 1,2023 전부 허용
    const dateMatch = txt.match(
        /^([A-Za-z]+)\s+(\d{1,2})(?:,)?\s+(\d{4})/
    );

    const date = dateMatch
        ? `${dateMatch[1]} ${dateMatch[2]}, ${dateMatch[3]}`
        : null;

    // 날짜 부분 제거
    const rest = dateMatch ? txt.slice(dateMatch[0].length).trim() : txt;

    // source 파싱
    const pairs = [...rest.matchAll(/([^,]+?)\s([\d,]+)\sstreams/g)];

    let sources = {};
    for (const [, name, value] of pairs) {
        sources[name.trim()] = parseInt(value.replace(/,/g, ""));
    }

    return {
        date,
        ...sources
    };
});

console.log(streamsBySource);


// 4. followers

let followersAll = [...document.querySelectorAll('rect[aria-label]')].map(e => {
    let txt = e.getAttribute("aria-label");
    const m = txt.match(/(.+?), ([\d,]+) Followers/);
    return { date: m[1], followers: parseInt(m[2].replace(/,/g,"")) };
});

console.log(followersAll);
