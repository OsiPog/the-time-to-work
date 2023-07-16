const LETTERS = " s*G->9}XpL+[T]g3te{:0lSM%kEN&#!YFZmf$jx<7VI58AaU?nzicduWr§KBPO_JohHQC2DbvyR1w46q"

// An implementation of the Vigenere encryption with an addition of safety.
// (The used alphabet is randomized)
const vigenere = (string, key_string, decrypt = false) => {
    if ((string === "") || (key_string === "") || !string || !key_string) return;
    
    // Going through the whole string
    let new_string = "";
    for(let i=0; i<string.length; i++) {
        const key_char = key_string[i%key_string.length];
        // Skip if any character is not in the table
        if (!LETTERS.includes(string[i]) || !LETTERS.includes(key_char)) {
            new_string += string[i];
            continue;
        }
        
        // Getting the amount of shifting of the current char
        let key = LETTERS.indexOf(key_char);
        if (decrypt) key *= -1;
        
        let index = LETTERS.indexOf(string[i]) + key;
        if (index > LETTERS.length-1) index -= LETTERS.length;
        if (index < 0) index += LETTERS.length;
        new_string += LETTERS[index];
    }
    
    return new_string;
}
const forceDigitAmount = (num, digits) => {
    let result = num + ""
    for(let i=0;i<digits;i++) {
        if (i === 0 && num === 0) continue
        if (num < Math.pow(10, i)) result = "0" + result
    }
    return result
}

// Returns an amount of seconds into a time
const convertSecondsToTime = (duration, format="hh:mm:ss") => {
    let h = Math.floor(Math.abs(duration)/3600);
    let min = Math.abs(Math.floor((Math.abs(duration)-h*3600)/60));
    let s = Math.abs(duration)-h*3600-min*60;

    // Round up a value if the previous wasn't shown 
    // e.g. no seconds in format? round minutes if necessary
    if (!format.includes("s") && s >= 30) min++
    if (!format.includes("m") && min >= 30) h++

    let result = format

    const replaceTimeFormatWithDigitAmount = (num, type) => {
        let matches = result.match(new RegExp(`${type}*`, "g"))
        for (const match of matches) {
            if (match.length < 1) continue
            result = result.replace(match, forceDigitAmount(num, match.length))
        }
    }

    replaceTimeFormatWithDigitAmount(h, "h")
    replaceTimeFormatWithDigitAmount(min, "m")
    replaceTimeFormatWithDigitAmount(s, "s")

    // Add a dash to indicate a negative number
    return (duration < 0 ? "-":"") + result;
}

// Returns the week number of the year of a certain date
const weekOfTheYear = (date) => {
    const miliseconds_in_day = 1000*60*60*24 
    return Math.floor(
        (date.getTime() -
            (new Date(date.getFullYear(), 0, 0).getTime() + miliseconds_in_day) // needs to be shifted by a day
        ) 
        // sec  -min -h   -day  -week
        / 1000 / 60 / 60 / 24 / 7
    )
}

// Returns the timestamp for the start of the week Mon 00:00 UTC
const startOfWeek = (date) => {
    const day = new Date(Math.floor(date/86400000)*86400000)
    return new Date(day - (day.getDay()-1)*24*3600*1000)
}

// Checks if a seperator is needed 
// (e. g. if t1 is a week after t0 it returns a seperator string on seperation_type="week")
// t1, t0 are unix timestamps
const getSeperator = (t0, t1, seperation_type, force=false) => {
    const date0 = new Date(Number(t0)*1000);
    const week0 = weekOfTheYear(date0);
    const year0 = date0.getFullYear();

    const date1 = new Date(Number(t1)*1000);
    const week1 = weekOfTheYear(date1);
    const year1 = date1.getFullYear();

    switch(seperation_type) {
        case "week":
            if ((week1 > week0) || (year1 > year0) || force) {
                return year0 + " Week " + week0;
            }   
    }

    return null
}

// Shortcut for creating an element with a class a parent and inner text
const htmlElement = ( tag, {
    class_name = null,
    parent = null,
    text = null,
    attributes = null,
    children = null,
    event_listeners = null,
    }) => {
    
    // Creating the base element
    const element = document.createElement(tag);

    // class, parent and innerText
    if (class_name)
        element.className = class_name;
    if (parent) 
        parent.appendChild(element);
    if (text)
       element.innerText = text;
    
    // attributes should be dict of attributes e.g {"id": "4", "src": "path/to"}
    if (attributes)
        for(const attribute in attributes) {
            // On a value like false or undefined don't set the attribute
            if (attributes[attribute])
                element.setAttribute(attribute, attributes[attribute]);
        }
    
    // children should be an array of elements
    if (children) {
        for (const child of children) {
            element.appendChild(child);
        }
    }

    // event_listeners should be a dict e.g ("click": (el) => {})
    if (event_listeners) {
        for (const event in event_listeners) {
            element.addEventListener(event, () => {event_listeners[event](element)})
        }
    }


    return element
}

const addSetting = ({
    label,
    type,
    options, // Array of Objects {label, identifier, pre_selected}
    handler, // Will be executed on change: handler(option.identifier)
    additional_attributes,
}) => {
    const div_entries = document.querySelector("#settings>.content");
    
    // Label
    htmlElement("div", {text: label, parent: div_entries})

    let user_input

    switch (type) {
        case "select":
            user_input = htmlElement("select", {parent: div_entries, attributes: additional_attributes})
    
            for(const option of options) {
                const elem = htmlElement("option", {
                    attributes: {"value": option.identifier},
                    text: option.label,
                    parent: user_input
                })
                if (option.pre_selected) {
                    elem.setAttribute("selected", "")
                }
            }
            break
        
        case "input":
            user_input = htmlElement("input", {parent: div_entries, attributes: additional_attributes})
            break

        case "button":
            user_input = htmlElement("input", {parent: div_entries, attributes: additional_attributes})
            user_input.setAttribute("type", "button")
            user_input.addEventListener("click", handler)
            break
    }

    // fire the handler once a different option was selected
    if (type !== "button") user_input.addEventListener("change", () => {handler(user_input.value, user_input)})
}