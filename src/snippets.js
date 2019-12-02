export const headerSnippet = `
    <?require_once($_SERVER['DOCUMENT_ROOT'] . '/build/getWebpackAssets.php');?>
    <?if ($GLOBALS['VENDOR_STYLES'] !== ''):?>
        <link rel="stylesheet" href="/local/dist/<?=$GLOBALS['VENDOR_STYLES'];?>">
    <?endif;?>
    <?if ($GLOBALS['CUSTOM_STYLES'] !== ''):?>
        <link rel="stylesheet" href="/local/dist/<?=$GLOBALS['CUSTOM_STYLES'];?>">
    <?endif;?>
</head>
`;

export const footerSnippet = `
    <?if ($GLOBALS['VENDOR_SCRIPTS'] !== ''):?>
        <script src="/local/dist/<?=$GLOBALS['VENDOR_SCRIPTS'];?>"></script>
    <?endif;?>
    <?if ($GLOBALS['CUSTOM_SCRIPTS'] !== ''):?>
        <script src="/local/dist/<?=$GLOBALS['CUSTOM_SCRIPTS'];?>"></script>
    <?endif;?>
</body>
`;