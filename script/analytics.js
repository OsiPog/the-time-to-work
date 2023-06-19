const getSummaryOf = (time_span) => {
    const summary = {}
    let duration_sum = 0
    let overtime = 0

    const today = new Date()
    let ignore_before = today;
    let next_expiration_date;

    switch (time_span) {
        case "this week":
            ignore_before = startOfWeek(today)
            next_expiration_date = Math.round(startOfWeek(new Date(3600*24*7*1000 + today*1))/1000) // seconds*hours*days in mili
            break
    }
    ignore_before /= 1000 // convert to seconds

    for (const entry of config.history) {
        if (entry[1] < ignore_before) continue

        const duration = entry[2] - entry[1]
        summary[entry[0]] = summary[entry[0]]+duration || duration
        duration_sum += duration
    }

    console.log(new Date(3600*24*7*1000 + today*1))

    // Calculate overtime
    overtime = duration_sum - config.overtime.threshold
    if (config.overtime.sum_expiration_date < today/1000) {
        config.overtime.sum_expiration_date = next_expiration_date
        config.overtime.sum += overtime 
    }

    // Make output string
    // work types
    let work_types = ""
    for (const work_type_name in summary) {
        let work_type = template.work_types
        .replace(/\{work\_type\}/g, work_type_name)
        .replace(/\{duration\}/g, 
            convertSecondsToTime(summary[work_type_name], template.time))

        work_types += work_type
    }

    // Whole summary
    return template.text
    .replace(/\{work\_types\}/g, work_types) 
    .replace(/\{duration\_sum\}/g, convertSecondsToTime(duration_sum, template.time))
    .replace(/\{overtime\}/g, convertSecondsToTime(overtime, template.time))
    .replace(/\{overtime\_sum\}/g, convertSecondsToTime(config.overtime.sum, template.time))
}

const updateSummary = () => {
    div_output_content.innerHTML = getSummaryOf("this week")
}

const init = async() => {
    // Globals
    config = await getConfig().catch(e => {
        console.log(e);
    });

    div_history = document.querySelector("div#list");
    div_output_content = document.querySelector("div#summary>#output>.content");
    template = config.templates[config.selected_template]

    // Create History
    updateHistory(seperation="week", update_all=true, hide_buttons=true)

    // Threshold
    addSetting({
        label: "Overtime threshold (h)",
        type: "input",
        additional_attributes: {"placeholder": config.overtime.threshold / 3600},
        handler: (val, elem) => {
            if (!Number(val)) {
                elem.value = ""
                return
            }
            config.overtime.threshold = val*3600
            saveConfig()
            window.location.reload()
        }
    })

    const options = []
    for (const template_name in config.templates) {
        options.push({
            identifier: template_name,
            label: template_name,
            pre_selected: template_name === config.selected_template
        })
    }


    addSetting({
        label: "Summary template",
        type: "select",
        options,
        handler: (val) => {
            config.selected_template = val
            saveConfig()
            window.location.reload()
        }
    })

    addSetting({
        label: "Edit overtime",
        type: "input",
        additional_attributes: {"placeholder": convertSecondsToTime(config.overtime.sum, "hh:mm")},
        handler: (val, elem) => {
            const time = val.split(":")
            if (!time || !(Number(time[0]) + Number(time[1])) && (Number(time[0]) + Number(time[1]) !== 0)) {
                elem.value = ""
                return
            }
            const [h, min] = [Number(time[0]), Number(time[1])]
            config.overtime.sum = h*3600 + min*60
            saveConfig()
            window.location.reload()
        }
    })
}

// Declare globals
let config;
let div_history;
let div_output_content;
let template;

init().then(() => {
    updateSummary()
});