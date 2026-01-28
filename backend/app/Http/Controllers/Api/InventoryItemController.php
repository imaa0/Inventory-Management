<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryItemController extends Controller
{
    public function index(Request $request)
    {
        $query = InventoryItem::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $items = $query->orderBy('name')->get();

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|numeric|min:0',
            'unit' => 'required|in:kg,m,cm,units,l,g',
        ]);

        DB::beginTransaction();
        try {
            $item = InventoryItem::create($request->only(['name', 'description', 'quantity', 'unit']));
            
            // Create initial transaction
            $item->transactions()->create([
                'user_id' => $request->user()->id,
                'type' => 'addition',
                'quantity' => $request->quantity,
                'notes' => 'Initial stock',
            ]);

            DB::commit();
            return response()->json($item->load('transactions'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create item'], 500);
        }
    }

    public function storeBulk(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.name' => 'required|string|max:255',
            'items.*.description' => 'nullable|string',
            'items.*.quantity' => 'required|numeric|min:0',
            'items.*.unit' => 'required|in:kg,m,cm,units,l,g',
        ]);

        DB::beginTransaction();
        try {
            $createdItems = [];
            
            foreach ($request->items as $itemData) {
                $item = InventoryItem::create($itemData);
                
                $item->transactions()->create([
                    'user_id' => $request->user()->id,
                    'type' => 'addition',
                    'quantity' => $itemData['quantity'],
                    'notes' => 'Initial stock',
                ]);
                
                $createdItems[] = $item->load('transactions');
            }

            DB::commit();
            return response()->json($createdItems, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create items'], 500);
        }
    }

    public function show($id)
    {
        $item = InventoryItem::with('transactions.user')->findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'unit' => 'sometimes|in:kg,m,cm,units,l,g',
        ]);

        $item = InventoryItem::findOrFail($id);
        $item->update($request->only(['name', 'description', 'unit']));

        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = InventoryItem::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Item deleted successfully']);
    }

    public function addStock(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $item = InventoryItem::findOrFail($id);
            $item->addStock($request->quantity, $request->user()->id, $request->notes);
            
            DB::commit();
            return response()->json($item->load('transactions'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function deductStock(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $item = InventoryItem::findOrFail($id);
            $item->deductStock($request->quantity, $request->user()->id, $request->notes);
            
            DB::commit();
            return response()->json($item->load('transactions'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function bulkAddStock(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $updatedItems = [];
            
            foreach ($request->items as $itemData) {
                $item = InventoryItem::findOrFail($itemData['id']);
                $item->addStock(
                    $itemData['quantity'],
                    $request->user()->id,
                    $itemData['notes'] ?? null
                );
                $updatedItems[] = $item->fresh()->load('transactions');
            }

            DB::commit();
            return response()->json($updatedItems);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function bulkDeductStock(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $updatedItems = [];
            
            foreach ($request->items as $itemData) {
                $item = InventoryItem::findOrFail($itemData['id']);
                $item->deductStock(
                    $itemData['quantity'],
                    $request->user()->id,
                    $itemData['notes'] ?? null
                );
                $updatedItems[] = $item->fresh()->load('transactions');
            }

            DB::commit();
            return response()->json($updatedItems);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
