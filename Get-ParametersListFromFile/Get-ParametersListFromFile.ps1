param($file_path)

function Get-ParametersListFromFile{
    param($file_path)
    
    ### 変数定義 ###
    # 各セクションごとにパラメータをまとめるオブジェクト（返り値）
    Set-Variable param_objs -Option AllScope
    $param_objs = @{}
    
    # オブジェクトの要素を定義
    Set-Variable param_objs -Option AllScope
    $param_obj = @{
        name = $null
        params = $null
        start_row = $null
        end_row = $null
    }
    
    # 読み込んだ生テキスト
    Set-Variable context -Option AllScope
    $context = Get-Content $file_path -encoding String
    
    # セクションの区切り文字
    Set-Variable delimiter -Option AllScope
    Set-Variable split_symbol -Option AllScope
    Set-Variable comment_symbol -Option AllScope
    Set-Variable comment_delimiter -Option AllScope
    $delimiter = "^\[(.*)\]$"
    $comment_symbol = "#"
    $comment_delimiter = (".*\s+" + $comment_symbol + ".*")
    $split_symbol = ":"


    ### メソッド定義 ###
    # セクション用オブジェクトを作成
    function generate_object{
        param($section_info)
        $section = $section_info.Split($split_symbol)[0]

        if($section_info.Split($split_symbol)[1] -eq $null){
            $name = $section
        }
        else{
            $name = ($section_info.Split($split_symbol)[1])
        }
    
        # オブジェクト生成
        function generate{
            $param_objs.Add($section, ($param_obj | Select-Object name,start_row,end_row,params))
        }
        
        # 各オブジェクトを初期化
        function initialize{
            $param_objs.$section.name = $name
            $param_objs.$section.params = @()
            $param_objs.$section.start_row = 0
            $param_objs.$section.end_row = 0
        }
        generate
        initialize
    }

    # 各セクションのオブジェクトを生成し、開始行と終了行を取得
    function search_rows{
        $now_row = 0
        $save_tmp = $null    # 前回の区切り文字を保持しておく変数
        foreach($row in $context){
            # 区切り文字の存在判定
            if($row -match $delimiter){
                # 前回の変数の終了行を取得
                if($save_tmp -ne $null){
                    (($param_objs).$save_tmp).end_row = ($now_row - 1)
                }

                $section_info = $row -replace $delimiter, '$1'
                
                generate_object $section_info
                
                $section = $section_info.Split($split_symbol)[0]
                $save_tmp = $section
                (($param_objs).$section).start_row = $now_row
            }
            $now_row++
        }
    }
    
    # 各セクションのパラメータを各オブジェクトに取得
    function get_params{
        search_rows
        foreach($key in $param_objs.Keys){
            for($i = $param_objs.$key.start_row+1; $i -lt $param_objs.$key.end_row; $i++){
                $param = $context[$i]
                # 行頭にコメントアウト記号が書かれていたら除外
                if($param -notmatch ("^" + $comment_symbol)){
                    if($param -match $comment_delimiter){
                        # 途中に空白(一つ以上)+コメントアウト記号が書かれていたら空白以降を除外
                        $param = $param.Split($comment_symbol)[0]
                    }
                    $param_objs.$key.params += $param
                }
            }
        }
    }

    ### メイン実行 ###
    get_params


    ### 表示 ###
    foreach($section in $param_objs.Keys){
        Write-Output ("＜" + $param_objs.$section.name + "＞")
        Write-Output $param_objs.$section.params
        Write-Output ""
    }

    $param_objs
}

Get-ParametersListFromFile $file_path
