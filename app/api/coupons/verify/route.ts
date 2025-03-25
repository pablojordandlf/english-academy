import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, billingCycle } = body;

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Código de cupón requerido" },
        { status: 400 }
      );
    }

    try {
      // Simular la validación del cupón con códigos predefinidos
      // En producción, esto se conectaría a tu base de datos o a Stripe
      const validCoupons: Record<string, { discount: number, validBillingCycles: string[] }> = {
        "WELCOME50": { discount: 50, validBillingCycles: ["monthly", "yearly"] },
        
      };

      // Verificar si el cupón existe
      if (!validCoupons[code]) {
        return NextResponse.json(
          { valid: false, message: "Cupón no válido" },
          { status: 200 }
        );
      }

      // Verificar si el cupón es válido para el ciclo de facturación seleccionado
      const couponInfo = validCoupons[code];
      if (billingCycle && !couponInfo.validBillingCycles.includes(billingCycle)) {
        return NextResponse.json(
          { 
            valid: false, 
            message: `Este cupón solo es válido para planes ${couponInfo.validBillingCycles.join(", ")}` 
          },
          { status: 200 }
        );
      }

      // Cupón válido
      return NextResponse.json(
        { 
          valid: true, 
          discount: couponInfo.discount,
          code: code
        },
        { status: 200 }
      );
      
    } catch (error) {
      console.error("Error verificando cupón:", error);
      return NextResponse.json(
        { valid: false, message: "Error al verificar el cupón" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error procesando la solicitud:", error);
    return NextResponse.json(
      { valid: false, message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
} 