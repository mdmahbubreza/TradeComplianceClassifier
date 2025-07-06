"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Upload,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  History,
  Loader2,
  FileText,
  Globe,
  DollarSign,
  Eye,
  Calendar,
  Package,
  MapPin,
  Trash2,
  ArrowLeft,
} from "lucide-react"

interface ClassificationResult {
  hsCodes: {
    code: string
    description: string
    reasoning: string
    confidence: number
    generalDutyRate?: string
    specialDutyRate?: string
    column2DutyRate?: string
    applicableFtaCountries?: string
    applicableFtaRules?: string
  }[]
  ftaEligibility: {
    eligible: boolean
    program: string
    reasoning: string
    requirements: string[]
  }
  mpfExemption: {
    exempt: boolean
    reasoning: string
    citation: string
  }
  dutyInformation: {
    generalRate: string
    specialRate: string
    applicableFtas: string[]
    estimatedDuty: string
  }
  confidence: number
}

interface HistoryItem {
  id: string
  timestamp: string
  productTitle: string
  description: string
  countryOfOrigin: string
  fileName?: string
  result: ClassificationResult
}

const countries = [
  "Bangladesh",
  "China",
  "India",
  "Vietnam",
  "Mexico",
  "Canada",
  "United States",
  "Germany",
  "Italy",
  "Turkey",
  "Thailand",
  "Indonesia",
]

export default function TradeDashboard() {
  const [formData, setFormData] = useState({
    productTitle: "",
    description: "",
    countryOfOrigin: "",
    file: null as File | null,
  })

  const [result, setResult] = useState<ClassificationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [activeTab, setActiveTab] = useState("classify")
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null)
  const [showHistoryDetail, setShowHistoryDetail] = useState(false)

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("trade-compliance-history")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Failed to load history:", error)
      }
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("trade-compliance-history", JSON.stringify(history))
  }, [history])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call to Ollama
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResult: ClassificationResult = {
        hsCodes: [
          {
            code: "6104.32",
            description: "Shirts and shirt-blouses of cotton",
            reasoning: "Men's short-sleeve cotton T-shirts fall squarely under 'shirts of cotton' in heading 6104.32.",
            confidence: 95,
            generalDutyRate: "16.5%",
            specialDutyRate: "Free (A,AU,BH,CL,CO,D,E,IL,JO,KR,MA,OM,P,PA,PE,S,SG)",
            column2DutyRate: "90%",
            applicableFtaCountries: "A,AU,BH,CL,CO,D,E,IL,JO,KR,MA,OM,P,PA,PE,S,SG",
            applicableFtaRules: "CPTPP; US-Australia FTA; US-Bahrain FTA; US-Chile FTA; US-Colombia FTA",
          },
          {
            code: "6104.39.20",
            description: "Men's non-knitted cotton shirts, other",
            reasoning: "A more specific sub-item for cotton shirts that aren't knitted or elasticized at the seams.",
            confidence: 85,
            generalDutyRate: "17.7%",
            specialDutyRate: "Free (BH,CL,CO,IL,JO,KR,MA,OM,P,PA,PE,S,SG)",
            column2DutyRate: "90%",
          },
          {
            code: "6104.39",
            description: "Men's or boys' shirts, not knitted or crocheted, other",
            reasoning: "The broader catch-all heading if finer subdivisions don't apply.",
            confidence: 75,
            generalDutyRate: "16.5%",
            specialDutyRate: "Free (A,AU,BH,CL,CO,D,E,IL,JO,KR,MA,OM,P,PA,PE,S,SG)",
            column2DutyRate: "90%",
          },
        ],
        ftaEligibility: {
          eligible: true,
          program: "CBTPA (Caribbean Basin Trade Partnership Act)",
          reasoning:
            "Bangladesh-origin textiles may qualify under the U.S. CBTPA facility provisions or U.S.-Bangladesh trade initiatives.",
          requirements: [
            "Certificate of origin required",
            "Direct shipment from Bangladesh",
            "Compliance with yarn-forward rule",
          ],
        },
        mpfExemption: {
          exempt: true,
          reasoning: "Textiles entered under eligible CBTPA/AGOA-style programs often enjoy MPF relief.",
          citation: "19 CFR § 24.23(c)",
        },
        dutyInformation: {
          generalRate: "16.5%",
          specialRate: "Free (under applicable FTA)",
          applicableFtas: ["CBTPA", "US-Bangladesh Trade Initiative"],
          estimatedDuty: "0% (FTA eligible)",
        },
        confidence: 88,
      }

      setResult(mockResult)

      // Add to history with complete product information
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        productTitle: formData.productTitle,
        description: formData.description,
        countryOfOrigin: formData.countryOfOrigin,
        fileName: formData.file?.name,
        result: mockResult,
      }
      setHistory((prev) => [historyItem, ...prev.slice(0, 49)]) // Keep last 50 items
    } catch (error) {
      console.error("Classification failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, file }))
    }
  }

  const exportResults = () => {
    if (!result) return

    const data = {
      productTitle: formData.productTitle,
      classification: result,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trade-classification-${Date.now()}.json`
    a.click()
  }

  const handleHistoryItemClick = (item: HistoryItem) => {
    setSelectedHistoryItem(item)
    setShowHistoryDetail(true)
  }

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening the detail view
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const clearAllHistory = () => {
    setHistory([])
    localStorage.removeItem("trade-compliance-history")
  }

  const loadHistoryItemToForm = (item: HistoryItem) => {
    setFormData({
      productTitle: item.productTitle,
      description: item.description,
      countryOfOrigin: item.countryOfOrigin,
      file: null, // Can't restore file from history
    })
    setResult(item.result)
    setActiveTab("classify")
    setShowHistoryDetail(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Trade Compliance Classifier</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="classify">Classification</TabsTrigger>
            <TabsTrigger value="history" className="relative">
              History
              {history.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {history.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classify">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Panel */}
              <Card className="h-fit">
                <CardHeader className="bg-blue-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Product Information
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Enter product details for HTS classification
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Product Title *</Label>
                      <Input
                        id="title"
                        value={formData.productTitle}
                        onChange={(e) => setFormData((prev) => ({ ...prev, productTitle: e.target.value }))}
                        placeholder="e.g., Men's Short-Sleeve Cotton T-Shirt"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Detailed product description including materials, construction, intended use..."
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country of Origin *</Label>
                      <Select
                        value={formData.countryOfOrigin}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, countryOfOrigin: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="file">Technical Specifications (Optional)</Label>
                      <div className="mt-1">
                        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50">
                          <div className="text-center">
                            <Upload className="mx-auto h-8 w-8 text-blue-400 mb-2" />
                            <p className="text-sm text-blue-600">
                              {formData.file ? formData.file.name : "Upload files or drag and drop"}
                            </p>
                            <p className="text-xs text-gray-500">PDF, DOC, or images up to 10MB</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                        </label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={loading || !formData.productTitle || !formData.description || !formData.countryOfOrigin}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Classifying...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Classify Product
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              {/* Knowledge Base */}
              {/* Results Panel */}
              <div className="space-y-6">
                {result ? (
                  <>
                    {/* Confidence Meter */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Classification Confidence</span>
                          <span className="text-sm text-blue-600 font-semibold">{result.confidence}%</span>
                        </div>
                        <Progress value={result.confidence} className="h-2" />
                      </CardContent>
                    </Card>

                    {/* HS Codes */}
                    <Card>
                      <CardHeader className="bg-green-50">
                        <CardTitle className="flex items-center gap-2 text-green-800">
                          <FileText className="h-5 w-5" />
                          HS Code Classification
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {result.hsCodes.map((hsCode, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border ${index === 0 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Badge
                                  variant={index === 0 ? "default" : "secondary"}
                                  className={index === 0 ? "bg-green-600" : ""}
                                >
                                  {hsCode.code}
                                </Badge>
                                <span className="text-xs text-gray-500">{hsCode.confidence}% match</span>
                              </div>
                              <h4 className="font-medium text-sm mb-1">{hsCode.description}</h4>
                              <p className="text-xs text-gray-600 mb-2">{hsCode.reasoning}</p>
                              {hsCode.generalDutyRate && (
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-500">General Rate: </span>
                                    <span className="font-medium text-red-600">{hsCode.generalDutyRate}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Special Rate: </span>
                                    <span className="font-medium text-green-600">
                                      {hsCode.specialDutyRate?.includes("Free") ? "Free (FTA)" : hsCode.specialDutyRate}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* FTA Eligibility */}
                    <Card>
                      <CardHeader className="bg-blue-50">
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                          <Globe className="h-5 w-5" />
                          FTA Eligibility
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          {result.ftaEligibility.eligible ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <Badge
                            variant={result.ftaEligibility.eligible ? "default" : "destructive"}
                            className={result.ftaEligibility.eligible ? "bg-green-600" : ""}
                          >
                            {result.ftaEligibility.eligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-2">{result.ftaEligibility.program}</p>
                        <p className="text-sm text-gray-600 mb-3">{result.ftaEligibility.reasoning}</p>
                        {result.ftaEligibility.requirements.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Requirements:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {result.ftaEligibility.requirements.map((req, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* MPF Exemption */}
                    <Card>
                      <CardHeader className="bg-purple-50">
                        <CardTitle className="flex items-center gap-2 text-purple-800">
                          <DollarSign className="h-5 w-5" />
                          MPF Exemption Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          {result.mpfExemption.exempt ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <Badge
                            variant={result.mpfExemption.exempt ? "default" : "destructive"}
                            className={result.mpfExemption.exempt ? "bg-green-600" : ""}
                          >
                            {result.mpfExemption.exempt ? "EXEMPT" : "NOT EXEMPT"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{result.mpfExemption.reasoning}</p>
                        <p className="text-xs text-blue-600 font-mono">{result.mpfExemption.citation}</p>
                      </CardContent>
                    </Card>

                    {/* Knowledge Base */}
                    <Card>
                      <CardHeader className="bg-purple-50">
                        <CardTitle className="flex items-center gap-2 text-purple-800">
                          <FileText className="h-5 w-5" />
                          Knowledge Base
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 mb-3">
                            Add documents to improve classification accuracy for future products
                          </p>
                          <Button
                            variant="outline"
                            className="w-full bg-transparent border-purple-200 hover:bg-purple-50"
                            onClick={() => {
                              // Handle document upload for knowledge base
                              const input = document.createElement("input")
                              input.type = "file"
                              input.multiple = true
                              input.accept = ".pdf,.doc,.docx,.txt"
                              input.onchange = (e) => {
                                const files = (e.target as HTMLInputElement).files
                                if (files) {
                                  console.log(
                                    "Files selected for knowledge base:",
                                    Array.from(files).map((f) => f.name),
                                  )
                                  // Here you would implement the logic to add documents to the model's knowledge base
                                }
                              }
                              input.click()
                            }}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Add Documents to Knowledge Base
                          </Button>
                          <p className="text-xs text-gray-500 text-center">Supported formats: PDF, DOC, DOCX, TXT</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Export Button */}
                    <Button onClick={exportResults} variant="outline" className="w-full bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      Export Results
                    </Button>
                  </>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Enter product details and click "Classify Product" to see results</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Classification History
                    </CardTitle>
                    <CardDescription>Recent product classifications and results</CardDescription>
                  </div>
                  {history.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllHistory}
                      className="text-red-600 hover:text-red-700 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                        onClick={() => handleHistoryItemClick(item)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-lg group-hover:text-blue-600 transition-colors">
                                {item.productTitle}
                              </h3>
                              <Eye className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {item.timestamp}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {item.countryOfOrigin}
                              </span>
                              {item.fileName && (
                                <span className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  {item.fileName}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => deleteHistoryItem(item.id, e)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="outline" className="font-mono">
                            {item.result.hsCodes[0]?.code}
                          </Badge>
                          <span
                            className={`flex items-center gap-1 ${item.result.ftaEligibility.eligible ? "text-green-600" : "text-red-600"}`}
                          >
                            {item.result.ftaEligibility.eligible ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            FTA {item.result.ftaEligibility.eligible ? "Eligible" : "Not Eligible"}
                          </span>
                          <span
                            className={`flex items-center gap-1 ${item.result.mpfExemption.exempt ? "text-green-600" : "text-red-600"}`}
                          >
                            {item.result.mpfExemption.exempt ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            MPF {item.result.mpfExemption.exempt ? "Exempt" : "Not Exempt"}
                          </span>
                          <Badge variant="secondary" className="ml-auto">
                            {item.result.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No classification history yet</p>
                    <p className="text-sm">Completed classifications will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* History Detail Modal */}
        <Dialog open={showHistoryDetail} onOpenChange={setShowHistoryDetail}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {selectedHistoryItem?.productTitle}
              </DialogTitle>
              <DialogDescription>Classification details from {selectedHistoryItem?.timestamp}</DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[70vh]">
              {selectedHistoryItem && (
                <div className="space-y-6">
                  {/* Product Information */}
                  <Card>
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="text-blue-800">Product Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Product Title</Label>
                        <p className="text-sm mt-1">{selectedHistoryItem.productTitle}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Description</Label>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{selectedHistoryItem.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Country of Origin</Label>
                          <p className="text-sm mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {selectedHistoryItem.countryOfOrigin}
                          </p>
                        </div>
                        {selectedHistoryItem.fileName && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Attached File</Label>
                            <p className="text-sm mt-1 flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {selectedHistoryItem.fileName}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Classification Results */}
                  <div className="space-y-4">
                    {/* Confidence */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Classification Confidence</span>
                          <span className="text-sm text-blue-600 font-semibold">
                            {selectedHistoryItem.result.confidence}%
                          </span>
                        </div>
                        <Progress value={selectedHistoryItem.result.confidence} className="h-2" />
                      </CardContent>
                    </Card>

                    {/* HS Codes */}
                    <Card>
                      <CardHeader className="bg-green-50">
                        <CardTitle className="flex items-center gap-2 text-green-800">
                          <FileText className="h-5 w-5" />
                          HS Code Classification
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {selectedHistoryItem.result.hsCodes.map((hsCode, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border ${index === 0 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Badge
                                  variant={index === 0 ? "default" : "secondary"}
                                  className={index === 0 ? "bg-green-600" : ""}
                                >
                                  {hsCode.code}
                                </Badge>
                                <span className="text-xs text-gray-500">{hsCode.confidence}% match</span>
                              </div>
                              <h4 className="font-medium text-sm mb-1">{hsCode.description}</h4>
                              <p className="text-xs text-gray-600 mb-2">{hsCode.reasoning}</p>
                              {hsCode.generalDutyRate && (
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-500">General Rate: </span>
                                    <span className="font-medium text-red-600">{hsCode.generalDutyRate}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Special Rate: </span>
                                    <span className="font-medium text-green-600">
                                      {hsCode.specialDutyRate?.includes("Free") ? "Free (FTA)" : hsCode.specialDutyRate}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* FTA Eligibility */}
                    <Card>
                      <CardHeader className="bg-blue-50">
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                          <Globe className="h-5 w-5" />
                          FTA Eligibility
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          {selectedHistoryItem.result.ftaEligibility.eligible ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <Badge
                            variant={selectedHistoryItem.result.ftaEligibility.eligible ? "default" : "destructive"}
                            className={selectedHistoryItem.result.ftaEligibility.eligible ? "bg-green-600" : ""}
                          >
                            {selectedHistoryItem.result.ftaEligibility.eligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-2">{selectedHistoryItem.result.ftaEligibility.program}</p>
                        <p className="text-sm text-gray-600 mb-3">
                          {selectedHistoryItem.result.ftaEligibility.reasoning}
                        </p>
                        {selectedHistoryItem.result.ftaEligibility.requirements.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Requirements:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {selectedHistoryItem.result.ftaEligibility.requirements.map((req, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* MPF Exemption */}
                    <Card>
                      <CardHeader className="bg-purple-50">
                        <CardTitle className="flex items-center gap-2 text-purple-800">
                          <DollarSign className="h-5 w-5" />
                          MPF Exemption Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          {selectedHistoryItem.result.mpfExemption.exempt ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <Badge
                            variant={selectedHistoryItem.result.mpfExemption.exempt ? "default" : "destructive"}
                            className={selectedHistoryItem.result.mpfExemption.exempt ? "bg-green-600" : ""}
                          >
                            {selectedHistoryItem.result.mpfExemption.exempt ? "EXEMPT" : "NOT EXEMPT"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {selectedHistoryItem.result.mpfExemption.reasoning}
                        </p>
                        <p className="text-xs text-blue-600 font-mono">
                          {selectedHistoryItem.result.mpfExemption.citation}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => loadHistoryItemToForm(selectedHistoryItem)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Load to Form
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const data = {
                          productInfo: {
                            title: selectedHistoryItem.productTitle,
                            description: selectedHistoryItem.description,
                            countryOfOrigin: selectedHistoryItem.countryOfOrigin,
                            fileName: selectedHistoryItem.fileName,
                          },
                          classification: selectedHistoryItem.result,
                          timestamp: selectedHistoryItem.timestamp,
                        }
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `${selectedHistoryItem.productTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}-classification.json`
                        a.click()
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
