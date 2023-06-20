const getSummaryData = (from, to) => {
    const summary = {}
    let duration_sum = 0

    let newest_entry_time = 0;
    for (const entry of config.history) {
        if ((entry[1] < from) && from !== -1) continue
        if ((entry[1] > to) && to !== -1) continue
        if (entry[2] === -1) continue

        const duration = entry[2] - entry[1]
        summary[entry[0]] = summary[entry[0]]+duration || duration
        duration_sum += duration

        if (entry[1] > newest_entry_time) {
            newest_entry_time = entry[1]
        }
    }

    let overtime = duration_sum - config.overtime.threshold

    return {summary, overtime, duration_sum, newest_entry_time}
}

const getSummaryOf = (time_span) => {
    const today = new Date()
    let ignore_before = today;
    let ignore_after = (config.history[0][1]+1)*1000

    let overtime_offset = 0

    let displayed_overtime_sum = config.overtime.sum

    switch (time_span) {
        case "this week":
            ignore_before = startOfWeek(today)
            break
        case "last week":
            displayed_overtime_sum -= getSummaryData(startOfWeek(today)/1000, startOfWeek(new Date(today + 86400*7*1000))/1000).overtime
            ignore_before = startOfWeek(new Date(today - 86400*7*1000))
            ignore_after = startOfWeek(today)
            break
    }
    ignore_before /= 1000 // convert to seconds
    ignore_after /= 1000

    const data = getSummaryData(ignore_before, ignore_after)

    // Make output string
    // work types
    let work_types = ""
    for (const work_type_name in data.summary) {
        let work_type = template.work_types
        .replace(/\{work\_type\}/g, work_type_name)
        .replace(/\{duration\}/g, 
            convertSecondsToTime(data.summary[work_type_name], template.time))

        work_types += work_type
    }

    // Whole summary
    return {
        string: template.text
                .replace(/\{work\_types\}/g, work_types) 
                .replace(/\{duration\_sum\}/g, convertSecondsToTime(data.duration_sum, template.time))
                .replace(/\{overtime\}/g, convertSecondsToTime(data.overtime, template.time))
                .replace(/\{overtime\_sum\}/g, convertSecondsToTime(displayed_overtime_sum, template.time)),
        data,
    }
}

const updateSummary = () => {
    div_output_content.innerHTML = getSummaryOf(config.summary_of).string
    saveConfig()
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
        label: "Summary of",
        type: "select",
        options: [
            {
                identifier: "this week",
                label: "this week",
                pre_selected: config.summary_of === "this week"
            },
            {
                identifier: "last week",
                label: "last week",
                pre_selected: config.summary_of === "last week"
            },
        ],
        handler: (val) => {
            config.summary_of = val
            saveConfig()
            window.location.reload()
        }
    })

    addSetting({
        label: "Update total overtime",
        type: "button",
        additional_attributes: {value: "Update"},
        handler: () => {
            config.overtime.sum += getSummaryOf(config.summary_of).data.overtime
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