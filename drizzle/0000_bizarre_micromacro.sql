CREATE TYPE "public"."order_status" AS ENUM('reservado', 'pagado', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('mercadopago', 'whatsapp_efectivo');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('card', 'box');--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"price_ars_at_purchase" numeric(12, 2) NOT NULL,
	"product_name" text NOT NULL,
	"product_img" text NOT NULL,
	"product_rarity" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"status" "order_status" DEFAULT 'reservado' NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"total_ars" numeric(12, 2) NOT NULL,
	"mp_payment_id" text,
	"whatsapp_sent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"items" jsonb NOT NULL,
	"total_ars" numeric(12, 2) NOT NULL,
	"user_id" uuid,
	"external_reference" text NOT NULL,
	"preference_id" text,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_sessions_external_reference_unique" UNIQUE("external_reference")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"type" "product_type" DEFAULT 'card' NOT NULL,
	"img" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"price_ars" numeric(12, 2) NOT NULL,
	"rarity" text NOT NULL,
	"rarity_code" text NOT NULL,
	"category" text NOT NULL,
	"product_line_name" text NOT NULL,
	"product_id" integer NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;