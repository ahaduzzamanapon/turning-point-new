<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return Inertia::render('Admin/Settings/Index', ['settings' => $settings]);
    }

    public function update(Request $request)
    {
        $validatedData = $request->validate([
            'app_name' => 'nullable|string|max:255',
            'sidebar_color' => 'nullable|string|max:7',
            'sidebar_text_color' => 'nullable|string|max:7',
            'admin_header_color' => 'nullable|string|max:7',
            'admin_header_text_color' => 'nullable|string|max:7',
            'font_family' => 'nullable|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        foreach ($validatedData as $key => $value) {
            if ($key === 'logo') {
                if ($request->hasFile('logo')) {
                    $path = $request->file('logo')->store('logos', 'public');
                    Setting::updateOrCreate(
                        ['key' => 'logo'],
                        ['value' => Storage::url($path)]
                    );
                }
            } else {
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value]
                );
            }
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}