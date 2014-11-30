/////////////////// Configuration for test templates //////////////////
testGroupTemplateConfigs = {
    Leakage: {
        // Setups for the supply pins:
        setups: {
            source_type: "V",
            source_value: "0",
            source_unit: "V"
        },

        // e.g. a source section and a sink section for continuity
        testSections: [
            {   // Continuity Source
                source_type: "V",
                source_value: "-0.2",
                source_unit: "V",
                compliance_type: "I",
                compliance_value: "-200",
                compliance_unit: "uA",
                measure_type: "I",
                measure_min: "-300",
                measure_typ: "0",
                measure_max: "20",
                measure_unit: "uA"
            },

            {   // Continuity Sink
                source_type: "V",
                source_value: "0.2",
                source_unit: "V",
                compliance_type: "I",
                compliance_value: "200",
                compliance_unit: "uA",
                measure_type: "I",
                measure_min: "-20",
                measure_typ: "0",
                measure_max: "300",
                measure_unit: "uA"
            }
        ]
    },

    Continuity: {
        // Setups for the supply pins:
        setups: {
            source_type: "V",
            source_value: "0",
            source_unit: "V"
        },

        // e.g. a source section and a sink section for continuity
        testSections: [
            {   // Continuity Source
                source_type: "I",
                source_value: "100",
                source_unit: "uA",
                compliance_type: "V",
                compliance_value: "2",
                compliance_unit: "V",
                measure_type: "V",
                measure_min: "0.35",
                measure_typ: "0.6",
                measure_max: "0.97",
                measure_unit: "V"
            },

            {   // Continuity Sink
                source_type: "I",
                source_value: "-100",
                source_unit: "uA",
                compliance_type: "V",
                compliance_value: "-2",
                compliance_unit: "V",
                measure_type: "V",
                measure_min: "-0.85",
                measure_typ: "-0.71",
                measure_max: "-0.35",
                measure_unit: "V"
            }
        ]
    }
};