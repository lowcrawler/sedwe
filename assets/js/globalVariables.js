/**
 * Created by jfederer on 3/6/2015.
 */
var ls = window.localStorage;
var setLetter = 65; //'A'
var SAMPLEQTY = 40;
var SETQTY = 90; //equivalent of 'Z'
var eventCounter = 1; //EC in localstorage
var eventArray = {}; //stores in an associative array the values that were stores in the eventKey item
var workingWithThisEvCounter = 1;
var addOrEdit = 0; //adding samples = 0, edit currentSamples = 1;
var currentContainerKey = ''; //used when editing containers

//TODO, all of these can be split up and created on the fly with an info array lookup

var P82398_SUSPENDED_SEDIMENT_OPTIONS = '<option value="">You must select one</option>' +
	'<option value="10">10 EQUAL WIDTH INCREMENT (EWI)</option>' +
	'<option value="15">15 EQUAL WIDTH INCREMENT, NON-ISOKINETIC</option>' +
	'<option value="20">20 EQUAL DISCHARGE INCREMENT (EDI)</option>' +
	'<option value="25">25 TIMED SAMPLING INTERVAL</option>' +
	'<option value="30">30 SINGLE VERTICAL</option>' +
	'<option value="40">40 MULTIPLE VERTICALS</option>' +
	'<option value="50">50 POINT SAMPLE</option>' +
	'<option value="55">55 COMPOSITE - MULTIPLE POINT SAMPLES</option>' +
	'<option value="60">60 WEIGHTED BOTTLE</option>' +
	'<option value="70">70 GRAB SAMPLE (DIP)</option>' +
	'<option value="80">80 DISCHARGE INTEGRATED, EQUAL TRANSIT RATE (ETR)</option>' +
	'<option value="90">90 DISCHARGE INTEGRATED, CENTROID</option>' +
	'<option value="100">100 VAN DORN SAMPLER</option>' +
	'<option value="110">110 SEWAGE SAMPLER</option>' +
	'<option value="120">120 VELOCITY INTEGRATED</option>' +
	'<option value="900">900 SUSPSED; PUMPING - stream sample using a pumping mechanism</option>' +
	'<option value="910">910 SUSPSED;SINGLE-STAGE,nozzle at fixed stage,passively fillng</option>' +
	'<option value="920">920 SUSPSED; BOX-SINGLE VER, DEPTH-INT, Attached To Structure</option>' +
	'<option value="930">930 SUSPSED;PARTIAL DEPTH,DEPTH integrated,part of single vert</option>' +
	'<option value="940">940 SUSPSED; PARTIAL WIDTH - DEP/WIDTH INT, part of X-section</option>' +
	'<option value="4010">4010 THIEF SAMPLE</option>' +
	'<option value="4020">4020 OPEN-TOP BAILER</option>' +
	'<option value="4025">4025 DOUBLE-VALVE BAILER</option>' +
	'<option value="8010">8010 OTHER</option>' +
	'<option value="8030">8030 GRAB SAMPLE AT WATER-SUPPLY TAP</option>' +
	'<option value="8040">8040 SPIGOT (NON-WATER-SUPPLY)</option>' +
	'<option value="8050">8050 GRAB SAMPLE AT TAP(S) ON A DAM</option>';

var SAMPLEMEDIUM_SUSPENDED_SEDIMENT_OPTIONS = '<option value="WS" >WS (Surface Water)</option>' +
	'<option value="WSQ">WSQ (Surface Water QC)</option>';

var P84164_SUSPENDED_SEDIMENT_OPTIONS = '<option value="">You must select one</option>' +
	'<option value="100">100 VAN DORN SAMPLER</option>' +
	'<option value="110">110 SEWAGE SAMPLE</option>' +
	'<option value="120">120 VELOCITY INTEGRATED SAMPLE</option>' +
	'<option value="125">125 KEMMERER BOTTLE</option>' +
	'<option value="3001">3001 SAMPLER, US DH-48</option>' +
	'<option value="3002">3002 SAMPLER, US DH-59</option>' +
	'<option value="3003">3003 SAMPLER, US DH-75P</option>' +
	'<option value="3004">3004 SAMPLER, US DH-75Q</option>' +
	'<option value="3005">3005 SAMPLER, US DH-76</option>' +
	'<option value="3006">3006 SAMPLER, US D-43</option>' +
	'<option value="3007">3007 SAMPLER, US D-49</option>' +
	'<option value="3008">3008 SAMPLER, US D-49AL</option>' +
	'<option value="3009">3009 SAMPLER, US D-74</option>' +
	'<option value="3010">3010 SAMPLER, US D-74AL</option>' +
	'<option value="3011">3011 SAMPLER, US D-77</option>' +
	'<option value="3012">3012 SAMPLER, US P-46</option>' +
	'<option value="3013">3013 SAMPLER, US P-50</option>' +
	'<option value="3014">3014 SAMPLER, US P-61-A1</option>' +
	'<option value="3015">3015 SAMPLER, US P-63</option>' +
	'<option value="3016">3016 SAMPLER, US P-72</option>' +
	'<option value="3017">3017 SAMPLER, US U-59</option>' +
	'<option value="3018">3018 SAMPLER, US U-73</option>' +
	'<option value="3019">3019 SAMPLER, US PS-69</option>' +
	'<option value="3020">3020 SAMPLER, US PS-69TM</option>' +
	'<option value="3021">3021 SAMPLER, US CS-77</option>' +
	'<option value="3022">3022 SAMPLER, US PS-82</option>' +
	'<option value="3030">3030 US DH-48 TM</option>' +
	'<option value="3031">3031 US DH-48 TM WITH TEFLON GASKET AND NOZZLE</option>' +
	'<option value="3032">3032 US DH-59 TM</option>' +
	'<option value="3033">3033 US DH-59 TM WITH TEFLON GASKET AND NOZZLE</option>' +
	'<option value="3034">3034 US DH-76 TM</option>' +
	'<option value="3035">3035 US DH-76 TM WITH TEFLON GASKET AND NOZZLE</option>' +
	'<option value="3036">3036 US D-74 TM</option>' +
	'<option value="3037">3037 US D-74 AL-TM</option>' +
	'<option value="3038">3038 US D-74 AL-TM WITH TEFLON GASKET AND NOZZLE</option>' +
	'<option value="3039">3039 US D-77 TM</option>' +
	'<option value="3040">3040 US D-77 TM MODIFIED TEFLON BAG SAMPLER</option>' +
	'<option value="3041">3041 US P-61 AL-TM</option>' +
	'<option value="3042">3042 US P-61</option>' +
	'<option value="3043">3043 US P-61 TM</option>' +
	'<option value="3044">3044 US DH-81</option>' +
	'<option value="3045">3045 US DH-81 WITH TEFLON CAP AND NOZZLE</option>' +
	'<option value="3046">3046 SAMPLER, D-77 TM, WITH REYNOLDS OVEN COLLAPSIBLE BAG</option>' +
	'<option value="3047">3047 SAMPLER, FRAME-TYPE, PLASTIC BOTTLE WITH REYNOLDS OVEN BAG</option>' +
	'<option value="3048">3048 SAMPLER, FRAME-TYPE, TEFLON BOTTLE</option>' +
	'<option value="3049">3049 SAMPLER, FRAME-TYPE, PLASTIC BOTTLE</option>' +
	'<option value="3050">3050 SAMPLER, FRAME-TYPE, PLASTIC BOTTLE W/TEFLON COLLAPS. BAG</option>' +
	'<option value="3051">3051 US DH-95 TEFLON BOTTLE</option>' +
	'<option value="3052">3052 US DH-95 PLASTIC BOTTLE</option>' +
	'<option value="3053">3053 US D-95 TEFLON BOTTLE</option>' +
	'<option value="3054">3054 US D-95 PLASTIC BOTTLE</option>' +
	'<option value="3055">3055 US D-96 BAG SAMPLER</option>' +
	'<option value="3056">3056 US D-96-A1 BAG SAMPLER</option>' +
	'<option value="3057">3057 US D-99 BAG SAMPLER</option>' +
	'<option value="3058">3058 US DH-2 BAG SAMPLER</option>' +
	'<option value="3060">3060 WEIGHTED-BOTTLE SAMPLER</option>' +
	'<option value="3061">3061 US WBH-96 WEIGHTED-BOTTLE SAMPLER</option>' +
	'<option value="3070">3070 GRAB SAMPLE</option>' +
	'<option value="3071">3071 OPEN-MOUTH BOTTLE</option>' +
	'<option value="3080">3080 VOC HAND SAMPLER</option>' +
	'<option value="4010">4010 THIEF SAMPLER</option>' +
	'<option value="4020">4020 OPEN-TOP BAILER</option>' +
	'<option value="4115">4115 SAMPLER, POINT, AUTOMATIC</option>' +
	'<option value="8010">8010 OTHER</option>';

var P82398_BOTTOM_MATERIAL_OPTIONS = '<option value="">You must select one</option>' +
	'<option value="50">50 POINT SAMPLE</option>' +
	'<option value="55">55 COMPOSITE - MULTIPLE POINT SAMPLES</option>' +
	'<option value="5010">5010 SEDIMENT CORE</option>' +
	'<option value="8010">8010 OTHER</option>';

var SAMPLEMEDIUM_BOTTOM_MATERIAL_OPTIONS = '<option value="SB" >SB (bottom material)</option>' +
	'<option value="SBQ">SBQ (bottom material QC)</option>';

var P84164_BOTTOM_MATERIAL_OPTIONS = '<option value="">You must select one</option>' +
	'<option value="3023">3023 SAMPLER, US BMH-53</option>' +
	'<option value="3024">3024 SAMPLER, US BMH-53TM</option>' +
	'<option value="3025">3025 SAMPLER, US BM-54</option>' +
	'<option value="3026">3026 SAMPLER, US BM-54TM</option>' +
	'<option value="3027">3027 SAMPLER, US BMH-60</option>' +
	'<option value="3028">3028 SAMPLER, US BMH-60TM</option>' +
	'<option value="3029">3029 SAMPLER, US RBM-80</option>' +
	'<option value="5010">5010 BOX CORE, LONG</option>' +
	'<option value="5020">5020 BOX CORE, SHORT</option>' +
	'<option value="5030">5030 GRAVITY CORE</option>' +
	'<option value="5040">5040 PISTON CORE</option>' +
	'<option value="5050">5050 PUSH CORE</option>' +
	'<option value="6000">6000 Bed Material -- Scoop Shovel</option>' +
	'<option value="6010">6010 Bed Material -- Scoop TM (Epoxy coated metal sampler)</option>' +
	'<option value="6020">6020 Bed Material -- Scoop Teflon</option>' +
	'<option value="6030">6030 Bed Material -- Pipe Dredge</option>' +
	'<option value="6040">6040 Bed Material -- Dredge-Cooper Scooper</option>' +
	'<option value="6050">6050 Bed Material -- Ponar Grab</option>' +
	'<option value="6060">6060 Bed Material -- Ekman Grab</option>' +
	'<option value="6070">6070 Bed Material -- Box Core Grab</option>' +
	'<option value="6080">6080 Bed Material -- Peterson Grab</option>' +
	'<option value="6090">6090 Bed Material -- Van Veen Grab</option>' +
	'<option value="8010">8010 OTHER</option>';


var P82398_BEDLOAD_OPTIONS = '<option value="">You must select one</option>' +
	'<option value="50">50 POINT SAMPLE</option>' +
	'<option value="55">55 COMPOSITE - MULTIPLE POINT SAMPLES</option>' +
	'<option value="1000">1000 BEDLOAD, SINGLE EQUAL WIDTH INCREMENT (SEWI)</option>' +
	'<option value="1010">1010 BEDLOAD, MULTIPLE EQUAL WIDTH INCREMENT (MEWI)</option>' +
	'<option value="1020">1020 BEDLOAD, UNEQUAL WIDTH INCREMENT (UWI)</option>' +
	'<option value="8010">8010 OTHER</option>';

var SAMPLEMEDIUM_BEDLOAD_OPTIONS = '<option value="WS" >WS (Surface Water)</option>' +
	'<option value="WSQ">WSQ (Surface Water QC)</option>';

var P84164_BEDLOAD_OPTIONS = '<option value="">You must select one</option>' +
	'<option value="1050">1050 BL-6X12 in, Toutle R. Type 2, Exp. Ratio 1.40, Cable Susp</option>' +
	'<option value="1055">1055 BL-6X12 in, Toutle R. Type 2, Exp. Ratio 1.40, Wading</option>' +
	'<option value="1060">1060 BL-3X3 in, BL-84, Exp. Ratio 1.40, Cable Susp</option>' +
	'<option value="1100">1100 BL-3X3 in, H-S, 50-100 lb, Exp. Ratio 3.22, Cable Susp</option>' +
	'<option value="1110">1110 BL-3X3 in, H-S, 100-200 lb,   Exp. Ratio 3.22, Cable Susp</option>' +
	'<option value="1120">1120 BL-3X3 in, H-S, 1/4-in thick nozzle,  Exp. Ratio 3.22, Wading</option>' +
	'<option value="1150">1150 BL-3X3 in, BLH-84, 1/4-in thick nozzle,  Exp. Ratio 1.4, Wading</option>' +
	'<option value="1170">1170 BL-6X6 in H-S, 1/4-in nozzle, 150-200 lb, Exp. Ratio 3.22, Cable Susp</option>' +
	'<option value="1180">1180 BL-4X8 in, Elwha R., Exp. Ratio 1.40, Wading</option>' +
	'<option value="1190">1190 BL-4X8 in, Elwha R., Exp. Ratio 1.40, Cable Susp</option>' +
	'<option value="1200">1200 BL-Net-Frame Trap</option>' +
	'<option value="8010">8010 OTHER</option>' +
	'<option value="8020">8020 Mulitple samplers used</option>';

