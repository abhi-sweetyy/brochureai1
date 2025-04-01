// Add a textarea for raw property data
<div className="mb-4">
  <label className="block text-white text-sm font-medium mb-2">
    Property Description (Raw)
  </label>
  <textarea
    className="w-full px-3 py-2 bg-[#1c2a47] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
    rows={10}
    value={formData.raw_property_data || ''}
    onChange={(e) => setFormData({...formData, raw_property_data: e.target.value})}
    placeholder="Paste the full property description here for AI processing..."
  />
</div> 