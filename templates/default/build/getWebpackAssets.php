<?php
// parsing file with current hashes bundled-files
$hashes = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT']."/dist/stats.json"), true);

$GLOBALS['VENDOR_STYLES'] = '';
$GLOBALS['VENDOR_SCRIPTS'] = '';

$GLOBALS['CUSTOM_STYLES'] = '';
$GLOBALS['CUSTOM_SCRIPTS'] = '';

foreach ($hashes['assetsByChunkName'] as $field => $value) {
    preg_match('/^\w*/', $value[0], $matches );
    switch ($matches[0]) {
        case 'custom':
        foreach ($value as $f => $val) {
            preg_match('/\.\w*$/', $val, $matches);
            switch ($matches[0]) {
                case ".css":
                    $GLOBALS['CUSTOM_STYLES'] = $val;
                    break;
                case ".js":
                    $GLOBALS['CUSTOM_SCRIPTS'] = $val;
                    break;
            }
        }
        case 'vendor':
            foreach ($value as $f => $val) {
                preg_match('/\.\w*$/', $val, $matches);
                switch ($matches[0]) {
                    case ".css":
                        $GLOBALS['VENDOR_STYLES'] = $val;
                        break;
                    case ".js":
                        $GLOBALS['VENDOR_SCRIPTS'] = $val;
                        break;
                }
            }
    }
}
?>
