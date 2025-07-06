import { parse } from "csv-parse"

async function verifyHtsSchema(url, expectedSchema) {
  try {
    const response = await fetch(url)
    const csvText = await response.text()

    const records = []
    const parser = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    })

    parser.on("readable", () => {
      let record
      while ((record = parser.read())) {
        records.push(record)
      }
    })

    parser.on("end", () => {
      if (records.length === 0) {
        console.log("CSV file is empty or could not be parsed.")
        return
      }

      const actualHeaders = Object.keys(records[0])
      const expectedHeaders = expectedSchema.map((item) => item.name)

      const isSchemaCorrect = JSON.stringify(actualHeaders) === JSON.stringify(expectedHeaders)

      if (isSchemaCorrect) {
        console.log("The schema is correct.")
      } else {
        console.log("The schema is incorrect.")
        console.log("Expected headers:", expectedHeaders)
        console.log("Actual headers:", actualHeaders)
      }
    })

    parser.on("error", (err) => {
      console.error(err.message)
    })
  } catch (error) {
    console.error("Failed to fetch or parse CSV:", error.message)
  }
}

const expectedSchema = [
  { name: "SKU ID", type: "string", exampleValue: "SKU2004" },
  { name: "Category/Sub-category", type: "string", exampleValue: "Category → Of paper yarn" },
  { name: "HTS Number", type: "string", exampleValue: "5311.00.60.00" },
  { name: "Description", type: "string", exampleValue: "Of paper yarn" },
  { name: "Country of Origin", type: "string", exampleValue: "Vietnam" },
  { name: "COGS/Unit Cost", type: "string", exampleValue: "72.66" },
  { name: "General Rate of Duty", type: "string", exampleValue: "2.7%" },
  {
    name: "Special Rate of Duty",
    type: "string",
    exampleValue: "Free (A,AU,BH,CL,CO,D,E,IL,JO,KR,MA,OM,P,PA,PE,S,SG)",
  },
  { name: "Column 2 Rate of Duty", type: "string", exampleValue: "40%" },
  { name: "Additional Duties", type: "null" },
  { name: "Applicable FTA Countries", type: "string", exampleValue: "A,AU,BH,CL,CO,D,E,IL,JO,KR,MA,OM,P,PA,PE,S,SG" },
  {
    name: "Applicable FTA Rules",
    type: "string",
    exampleValue:
      "CPTPP; EU Single Market; Other FTA; US-Bahrain FTA; US-Chile FTA; US-Colombia FTA; US-Israel FTA; US-Jordan FTA; US-Korea FTA; US-Morocco FTA; US-Oman FTA; US-Panama FTA; US-Peru FTA; US-Singapore FTA",
  },
]

verifyHtsSchema(
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HTS-UcSSwUxsgkOpEGptFirqmMl6uxxeMd.csv",
  expectedSchema,
)
