testHeaderDefaults = {
    columns: [
        {name: "pad", label: "Pad", show: true},
        {name: "pad2", label: "Pad2", show: false}, // For resistance tests that involves two pads.
        {name: "source_type", label:"Source", show: true},
        {name: "source_value", label:"Value", show: true},
        {name: "source_unit", label:"Unit", show: true},
        {name: "compliance_type", label:"Compliance", show: true},
        {name: "compliance_value", label:"Value", show:true},
        {name: "compliance_unit", label:"Unit", show:true},
        {name: "measure_type", label:"Measure", show:true},
        {name: "measure_min", label:"MIN", show:true},
        {name: "calculate", label:"Calculate", show:false}, // For calculation based on other measurements.
        {name: "measure_typ", label:"TYP", show:true},
        {name: "measure_max", label:"MAX", show:true},
        {name: "measure_unit", label:"Unit", show:true}
    ]
};