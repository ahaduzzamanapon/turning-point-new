<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Artisan;
use Spatie\Permission\Models\Permission;

class GenerateCrudCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-crud {--json= : Path to the JSON configuration file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generates CRUD operations based on a JSON configuration file.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $jsonFilePath = $this->option('json');

        if (!File::exists($jsonFilePath)) {
            $this->error('JSON configuration file not found: ' . $jsonFilePath);
            return Command::FAILURE;
        }

        $config = json_decode(File::get($jsonFilePath), true);

        $modelName = ucfirst(Str::singular($config['model_name'])); // e.g., 'Product'
        $tableName = Str::plural(Str::snake($modelName)); // e.g., 'products'
        $columns = $config['fields'];
        $timestamps = $config['timestamps'];
        $softDeletes = $config['soft_deletes'];
        $onlyMigration = $config['only_migration'];

        // 1. Generate Migration
        $this->info('Generating migration...');
        $this->generateMigration($tableName, $columns, $timestamps, $softDeletes);
        Artisan::call('migrate');
        $this->info(Artisan::output());

        if ($onlyMigration) {
            $this->info('Only migration generated. Exiting.');
            return Command::SUCCESS;
        }

        // 2. Generate Model
        $this->info('Generating model...');
        $this->generateModel($modelName, $columns);

        // 3. Generate Controller
        $this->info('Generating controller...');
        $this->generateController($modelName, $tableName, $columns);

        // 4. Generate Request
        $this->info('Generating request...');
        $this->generateRequest($modelName, $columns);

        // 5. Generate Inertia React Views
        $this->info('Generating Inertia React views...');
        $this->generateInertiaViews($modelName, $columns);

        // 6. Add routes
        $this->info('Adding routes...');
        $this->addRoutes($modelName);

        // 7. Create Permissions
        $this->info('Creating permissions...');
        $this->createPermissions($modelName);

        // 8. Add link to Sidebar.jsx
        $this->info('Adding link to Sidebar.jsx...');
        $this->addLinkToSidebar($modelName);

        $this->info('CRUD generation complete for ' . $modelName);
        shell_exec('npm run build');
        return Command::SUCCESS;
    }

    protected function addLinkToSidebar(string $modelName)
    {
        $sidebarPath = resource_path('js/Components/Sidebar.jsx');
        $sidebarContent = File::get($sidebarPath);

        $modelNamePlural = Str::plural($modelName); // e.g., 'Products'
        $modelNameLowerCasePlural = Str::lower($modelNamePlural); // e.g., 'products'

        $newLink = File::get(base_path('stubs/crud/sidebar_link.stub'));
        $newLink = str_replace(
            ['{{ modelNameLowerCase }}', '{{ modelNamePlural }}'],
            [$modelNameLowerCasePlural, $modelNamePlural],
            $newLink
        );

        // Find the insertion point (after the admin panel section)
        $insertionPoint = '</nav>';

        if (Str::contains($sidebarContent, $insertionPoint)) {
            $sidebarContent = str_replace(
                $insertionPoint,
                $newLink  . $insertionPoint,
                $sidebarContent
            );
            File::put($sidebarPath, $sidebarContent);
        } else {
            $this->warn('Could not find insertion point in Sidebar.jsx. Please add the link manually.');
        }
    }

    protected function generateMigration(string $tableName, array $columns, bool $timestamps, bool $softDeletes)
    {
        $schemaLines = [
            '$table->id();',
        ];

        foreach ($columns as $column) {
            $columnName = $column['name'];
            $dataType = $column['type'];
            $nullable = $column['nullable'] ? '->nullable()' : '';
            $defaultValue = $column['default'] ? "->default('{$column['default']}')" : '';

            $schemaLine = "\$table->{$dataType}('{$columnName}'){$nullable}{$defaultValue};";

            if ($column['relation'] === 'belongsTo') {
                $relatedModel = Str::singular($columnName);
                $schemaLine = " \$table->foreignId('{$relatedModel}_id')->constrained()->onDelete('cascade');";
            }

            $schemaLines[] = $schemaLine;
        }

        if ($softDeletes) {
            $schemaLines[] = "\$table->softDeletes();";
        }

        if ($timestamps) {
            $schemaLines[] = "\$table->timestamps();";
        }

        $migrationContent = File::get(base_path('stubs/crud/migration.stub'));
        $migrationContent = str_replace(
            ['{{ tableName }}', '{{ fullSchema }}'],
            [$tableName, implode("\n", $schemaLines)],
            $migrationContent
        );

        $migrationFileName = date('Y_m_d_His') . '_create_' . Str::snake($tableName) . '_table.php';
        File::put(database_path('migrations/' . $migrationFileName), $migrationContent);
    }

    protected function generateModel(string $modelName, array $columns)
    {
        $fillable = collect($columns)->map(fn($col) => "'{$col['name']}'")->implode(', ');

        $modelContent = File::get(base_path('stubs/crud/model.stub'));
        $modelContent = str_replace(
            ['{{ namespace }}', '{{ className }}', '{{ fillable }}'],
            ['App\\Models', $modelName, $fillable],
            $modelContent
        );

        File::put(app_path('Models/' . $modelName . '.php'), $modelContent);
    }

    protected function generateController(string $modelName, string $tableName, array $columns)
    {
        $controllerContent = File::get(base_path('stubs/crud/controller.stub'));
        $controllerContent = str_replace(
            ['{{ namespace }}', '{{ modelNamespace }}', '{{ modelName }}', '{{ className }}', '{{ modelNameLowerCase }}'],
            ['App\\Http\\Controllers', 'App\\Models', $modelName, $modelName . 'Controller', Str::lower(Str::plural($modelName))],
            $controllerContent
        );

        File::put(app_path('Http/Controllers/' . $modelName . 'Controller.php'), $controllerContent);
    }

    protected function generateRequest(string $modelName, array $columns)
    {
        $rules = collect($columns)->map(function ($col) {
            $rule = "'{$col['name']}' => '";
            $rule .= $col['nullable'] ? 'nullable' : 'required';
            if ($col['validation']) {
                $rule .= '|' . $col['validation'];
            }
            $rule .= "'";
            return $rule;
        })->implode(",\n            ");

        $requestContent = File::get(base_path('stubs/crud/request.stub'));
        $requestContent = str_replace(
            ['{{ namespace }}', '{{ className }}', '{{ rules }}'],
            ['App\\Http\\Requests', $modelName . 'Request', $rules],
            $requestContent
        );

        File::put(app_path('Http/Requests/' . $modelName . 'Request.php'), $requestContent);
    }

    protected function generateInertiaViews(string $modelName, array $columns)
    {
        $modelNameLowerCase = Str::lower(Str::plural($modelName)); // e.g., 'product'
        $viewPath = resource_path('js/Pages/' . $modelName);
        File::makeDirectory($viewPath, 0755, true, true);

        // Index.jsx
        $tableHeader = collect($columns)->map(fn($col) => "<th scope=\"col\" className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\">" . Str::title($col['name']) . "</th>")->implode("\n                                        ");
        $tableBody = collect($columns)->map(fn($col) => "<td className=\"px-6 py-4 whitespace-nowrap\">{item.{$col['name']}}</td>")->implode("\n                                            ");

        $indexContent = File::get(base_path('stubs/crud/Index.jsx.stub'));
        $indexContent = str_replace(
            ['{{ modelName }}', '{{ modelNameLowerCase }}', '{{ tableHeader }}', '{{ tableBody }}'],
            [$modelName, $modelNameLowerCase, $tableHeader, $tableBody],
            $indexContent
        );
        File::put($viewPath . '/Index.jsx', $indexContent);

        // Create.jsx
        $createContent = File::get(base_path('stubs/crud/Create.jsx.stub'));
        $createContent = str_replace(
            ['{{ modelName }}', '{{ modelNameLowerCase }}'],
            [$modelName, $modelNameLowerCase],
            $createContent
        );
        File::put($viewPath . '/Create.jsx', $createContent);

        // Edit.jsx
        $editContent = File::get(base_path('stubs/crud/Edit.jsx.stub'));
        $editContent = str_replace(
            ['{{ modelName }}', '{{ modelNameLowerCase }}'],
            [$modelName, $modelNameLowerCase],
            $editContent
        );
        File::put($viewPath . '/Edit.jsx', $editContent);

        // Form.jsx
        $formFields = collect($columns)->map(function ($col) {
            $label = Str::title($col['name']);
            $input = '';
            switch ($col['input_type']) {
                case 'text':
                case 'email':
                case 'number':
                case 'password':
                case 'date':
                case 'datetime-local':
                    $input = "<input type=\"" . $col['input_type'] . "\" id=\"" . $col['name'] . "\" value={data." . $col['name'] . "} onChange={(e) => setData('" . $col['name'] . "', e.target.value)} className=\"mt-1 block w-full rounded-md border-gray-300 shadow-sm\" />";
                    break;
                case 'textarea':
                    $input = "<textarea id=\"" . $col['name'] . "\" value={data." . $col['name'] . "} onChange={(e) => setData('" . $col['name'] . "', e.target.value)} className=\"mt-1 block w-full rounded-md border-gray-300 shadow-sm\"></textarea>";
                    break;
                case 'checkbox':
                    $input = "<input type=\"checkbox\" id=\"" . $col['name'] . "\" checked={data." . $col['name'] . "} onChange={(e) => setData('" . $col['name'] . "', e.target.checked)} className=\"rounded border-gray-300 text-indigo-600 shadow-sm\" />";
                    break;
                case 'select':
                    // This is a basic select, for dynamic options, more logic would be needed
                    $input = "<select id=\"" . $col['name'] . "\" value={data." . $col['name'] . "} onChange={(e) => setData('" . $col['name'] . "', e.target.value)} className=\"mt-1 block w-full rounded-md border-gray-300 shadow-sm\"><option value=\"\">Select...</option></select>";
                    break;
                // Add more input types as needed
            }
            return "<div className=\"mb-4\"><label htmlFor=\"" . $col['name'] . "\" className=\"block text-sm font-medium text-gray-700\">{$label}</label>" . $input . "{errors." . $col['name'] . " && <div className=\"text-red-500 text-sm mt-1\">{errors." . $col['name'] . "}</div>}</div>";
        })->implode("\n            ");

        $formContent = File::get(base_path('stubs/crud/Form.jsx.stub'));
        $formContent = str_replace(
            ['{{ formFields }}'],
            [$formFields],
            $formContent
        );
        File::put($viewPath . '/Form.jsx', $formContent);
    }

    protected function addRoutes(string $modelName)
    {
        $modelNameLowerCasePlural = Str::lower(Str::plural($modelName)); // e.g., 'products'
        $routeContent = File::get(base_path('routes/web.php'));

        $newRoutes = File::get(base_path('stubs/crud/routes.stub'));
        $newRoutes = str_replace(
            ['{{ modelNameLowerCase }}', '{{ modelName }}'],
            [$modelNameLowerCasePlural, $modelName],
            $newRoutes
        );

        // Check if the routes already exist to prevent duplication
        if (!Str::contains($routeContent, "Route::resource('{$modelNameLowerCasePlural}'")) {
            File::append(base_path('routes/web.php'), "\n" . $newRoutes . "\n");
        }
    }

    protected function createPermissions(string $modelName)
    {
        $modelNameSnakeCaseSingular = strtolower(Str::plural($modelName)); // e.g., 'product'

        $parentPermission = $modelNameSnakeCaseSingular . '_module';
        $permissions = [
            $modelNameSnakeCaseSingular . '_create',
            $modelNameSnakeCaseSingular . '_edit',
            $modelNameSnakeCaseSingular . '_update',
            $modelNameSnakeCaseSingular . '_delete',
            $modelNameSnakeCaseSingular . '_view',
        ];

        // Create parent permission if it doesn't exist
        $parentPerm = Permission::firstOrCreate(['name' => $parentPermission]);

        // Create child permissions and collect their names
        $childPermissionNames = [];
        foreach ($permissions as $permission) {
            $childPerm = Permission::firstOrCreate(['name' => $permission]);
            $childPermissionNames[] = $childPerm->name;
        }

        // Assign all relevant permissions to the admin role
        $adminRole = \Spatie\Permission\Models\Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->givePermissionTo($parentPerm);
            foreach ($childPermissionNames as $permName) {
                $adminRole->givePermissionTo($permName);
            }
        }
    }
}
