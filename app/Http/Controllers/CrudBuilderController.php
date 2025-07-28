<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;

class CrudBuilderController extends Controller
{
    public function index()
    {
        return Inertia::render('CrudBuilder/Index');
    }

    public function generate(Request $request)
    {
        $request->validate([
            'modelName' => 'required|string|max:255',
            'tableName' => 'nullable|string|max:255',
            'columns' => 'array',
            'columns.*.columnName' => 'required|string|max:255',
            'columns.*.dataType' => 'required|string|max:255',
            'columns.*.inputType' => 'required|string|max:255',
            'columns.*.validationRules' => 'nullable|string',
            'columns.*.defaultValue' => 'nullable|string',
            'columns.*.nullable' => 'boolean',
            'columns.*.relationship' => 'nullable|string',
            'timestamps' => 'boolean',
            'softDeletes' => 'boolean',
            'onlyMigration' => 'boolean',
        ]);

        $modelName = ucfirst($request->input('modelName'));
        $tableName = $request->input('tableName');

        // If tableName is not provided, generate it from modelName
        if (empty($tableName)) {
            $tableName = Str::plural(Str::snake($modelName));
        }

        $fields = [
            'model_name' => $modelName,
            'table_name' => $tableName,
            'fields' => [],
            'timestamps' => $request->input('timestamps'),
            'soft_deletes' => $request->input('softDeletes'),
            'only_migration' => $request->input('onlyMigration'),
        ];

        foreach ($request->input('columns') as $column) {
            $fields['fields'][] = [
                'name' => $column['columnName'],
                'type' => $column['dataType'],
                'input_type' => $column['inputType'],
                'validation' => $column['validationRules'],
                'default' => $column['defaultValue'],
                'nullable' => $column['nullable'],
                'relation' => $column['relationship'],
            ];
        }

        $jsonContent = json_encode($fields, JSON_PRETTY_PRINT);
        $jsonFilePath = storage_path('app/public/fields.json');
        File::put($jsonFilePath, $jsonContent);

        // Execute the custom generate-crud command
        Artisan::call('app:generate-crud', [
            '--json' => $jsonFilePath,
        ]);

        $output = Artisan::output();

        return Inertia::render('CrudBuilder/Index', [
            'output' => $output,
            'jsonConfig' => $jsonContent,
        ]);
}
}