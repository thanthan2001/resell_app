
key=tgb_fe1aecd77893df0c7591b584d080c540596ad4369c6c7608
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "openapi": "3.0.3",
    "info": {
      "title": "Buyer API",
      "version": "2.1.0",
      "description": "Public API for Telegram buyer keys.\n\n## Default rate limits\n\nAll quotas use a 60-second window:\n\n| Scope | Limit |\n| --- | ---: |\n| API key across all endpoints | 60 requests |\n| Source IP across all endpoints | 120 requests |\n| Buyer key: `products` | 30 requests |\n| Seller aggregate: `products` | 100 requests |\n| Buyer key: `balance` | 30 requests |\n| Seller aggregate: `balance` | 300 requests |\n| Buyer key: `purchase` | 60 requests |\n| Seller aggregate: `purchase` | 50 requests |\n| Invalid authentication attempts per key | 5 requests |\n| Invalid authentication attempts per IP | 15 requests |\n\n## Escalating abuse penalties\n\nWhen a key, IP, or seller aggregate exceeds a quota, it is temporarily\nblocked. Repeated violations within 24 hours increase the block duration\nthrough these levels: **1 minute, 5 minutes, 15 minutes, 1 hour, and 6 hours**.\nAdditional violations remain at level 5. Requests made while a penalty is\nalready active do not increase the level. The strike level resets after\n24 hours without another violation.\n\nA `429` response includes `Retry-After`, `X-RateLimit-Scope`, and\n`X-RateLimit-Penalty-Level`. Clients must wait for `Retry-After` and must\nnot retry in a tight loop.\n"
    },
    "servers": [
      {
        "url": "https://canboso.com"
      }
    ],
    "paths": {
      "/api/v2/telegram-buyer/products": {
        "get": {
          "summary": "List products for the buyer key",
          "description": "Public endpoint for buyer keys issued from Telegram, Telegram 2nd,\nBinance bot, or Bybit bot.\nThe API key already encodes which bot flow it belongs to, so the caller\ndoes not need to send any extra bot identifier.\nOnly fields visible or actionable in the Telegram buyer flow are returned.\nChatGPT Business Slot uses the public `productId`\n`slot_chatgpt_business` and advertises its required purchase inputs through\n`purchaseRequirements`.\nResponse language is determined by the language stored with the buyer API key.\n",
          "parameters": [
            {
              "in": "query",
              "name": "key",
              "required": true,
              "schema": {
                "type": "string",
                "example": "tgb_1234567890abcdef1234567890abcdef1234567890abcdef"
              },
              "description": "Unique buyer API key issued by the current bot."
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ProductsResponse"
                  }
                }
              }
            },
            "400": {
              "description": "Invalid request",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  }
                }
              }
            },
            "401": {
              "description": "Invalid API key",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  }
                }
              }
            },
            "429": {
              "$ref": "#/components/responses/RateLimited"
            }
          }
        }
      },
      "/api/v2/telegram-buyer/balance": {
        "get": {
          "summary": "Get current wallet balance for the buyer key",
          "description": "Public endpoint for buyer keys issued from Telegram, Telegram 2nd,\nBinance bot, or Bybit bot.\nThe wallet type is inferred from the buyer `key`.\nResponse language is determined by the language stored with the buyer API key.\n",
          "parameters": [
            {
              "in": "query",
              "name": "key",
              "required": true,
              "schema": {
                "type": "string",
                "example": "tgb_1234567890abcdef1234567890abcdef1234567890abcdef"
              },
              "description": "Unique buyer API key issued by the current bot."
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BalanceResponse"
                  },
                  "examples": {
                    "vndWallet": {
                      "summary": "Telegram wallet in VND mode",
                      "value": {
                        "success": true,
                        "lang": "vi",
                        "botSource": "primary",
                        "walletCurrency": "VND",
                        "requester": {
                          "chatId": 1336962312,
                          "name": "buyer_demo"
                        },
                        "balance": 250000,
                        "balanceVnd": 250000,
                        "balanceText": "250.000 ₫",
                        "usdtBalance": 0,
                        "updatedAt": "2026-03-25T09:15:00.000Z"
                      }
                    },
                    "usdWallet": {
                      "summary": "Binance or Bybit wallet in USD mode",
                      "value": {
                        "success": true,
                        "lang": "en",
                        "botSource": "binance",
                        "walletCurrency": "USD",
                        "requester": {
                          "chatId": 1336962312,
                          "name": "buyer_demo"
                        },
                        "balance": 18.259259,
                        "balanceUsd": 18.259259,
                        "balanceText": "$18.26",
                        "usdtBalance": 8,
                        "balanceVnd": 277000,
                        "usdRate": 27000,
                        "updatedAt": "2026-03-25T09:15:00.000Z"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Invalid request",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  }
                }
              }
            },
            "401": {
              "description": "Invalid API key",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  }
                }
              }
            },
            "429": {
              "$ref": "#/components/responses/RateLimited"
            }
          }
        }
      },
      "/api/v2/telegram-buyer/purchase": {
        "post": {
          "summary": "Purchase product by product_id using buyer key",
          "description": "Public endpoint for buyer keys issued from Telegram, Telegram 2nd,\nBinance bot, or Bybit bot.\nWallet payment only.\nThe wallet type and pricing flow are inferred from the buyer `key`.\nTo purchase ChatGPT Business Slot, send `product_id = slot_chatgpt_business`\ntogether with `customer_email` and `slot_months`.\nTo purchase a catalog product with `productType = slot`, send that\nproduct's `productId` together with `customer_email`. It does not use the\nChatGPT Business Slot flow and does not require `slot_months`.\nResponse language is determined by the language stored with the buyer API key.\nEvery purchase must include a unique `Idempotency-Key`. Retrying the\nexact same request with the same key returns the original response.\n",
          "parameters": [
            {
              "in": "header",
              "name": "Idempotency-Key",
              "required": true,
              "schema": {
                "type": "string",
                "minLength": 8,
                "maxLength": 128,
                "example": "purchase-20260726-4f47f23d"
              },
              "description": "Reuse this key only when retrying the exact same purchase request."
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PurchaseRequest"
                },
                "examples": {
                  "normalProduct": {
                    "summary": "Purchase a normal product",
                    "value": {
                      "key": "tgb_1234567890abcdef1234567890abcdef1234567890abcdef",
                      "product_id": "64f0c0f2b90c2b4c5a123456",
                      "quantity": 2
                    }
                  },
                  "slotProduct": {
                    "summary": "Purchase ChatGPT Business Slot",
                    "value": {
                      "key": "tgb_1234567890abcdef1234567890abcdef1234567890abcdef",
                      "product_id": "slot_chatgpt_business",
                      "customer_email": "buyer@example.com",
                      "slot_months": 3
                    }
                  },
                  "manualSlotProduct": {
                    "summary": "Purchase a catalog slot product",
                    "value": {
                      "key": "tgb_1234567890abcdef1234567890abcdef1234567890abcdef",
                      "product_id": "64f0c0f2b90c2b4c5a654321",
                      "quantity": 1,
                      "customer_email": "buyer@example.com"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Purchase completed",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PurchaseResponse"
                  },
                  "examples": {
                    "normalProduct": {
                      "summary": "Successful wallet purchase",
                      "value": {
                        "success": true,
                        "lang": "en",
                        "order": {
                          "orderCode": "ORDER1A2B3C4D5E",
                          "status": "completed",
                          "productId": "64f0c0f2b90c2b4c5a123456",
                          "productName": "ChatGPT Plus",
                          "productType": "account",
                          "quantity": 2,
                          "bonusQuantity": 1,
                          "finalQuantity": 3
                        },
                        "payment": {
                          "amount": 90000,
                          "amountText": "VND 90,000",
                          "originalAmount": 100000,
                          "originalAmountText": "VND 100,000",
                          "discountPercent": 10,
                          "discountAmount": 10000,
                          "discountAmountText": "VND 10,000",
                          "currency": "VND",
                          "balance": 120000,
                          "balanceText": "VND 120,000"
                        },
                        "delivery": {
                          "accounts": [
                            {
                              "user": "account1@example.com",
                              "password": "secret-password",
                              "verifyEmail": "recovery@example.com"
                            }
                          ]
                        }
                      }
                    },
                    "slotProduct": {
                      "summary": "Successful ChatGPT Business Slot purchase",
                      "value": {
                        "success": true,
                        "lang": "en",
                        "order": {
                          "orderCode": "ORDER6F7G8H9J0K",
                          "status": "completed",
                          "productId": "slot_chatgpt_business",
                          "productName": "ChatGPT Business Slot",
                          "productType": "slot",
                          "quantity": 1,
                          "bonusQuantity": 0,
                          "finalQuantity": 1,
                          "slotMonths": 3,
                          "customerEmail": "buyer@example.com",
                          "fulfillmentStatus": "invited"
                        },
                        "payment": {
                          "amount": 150000,
                          "amountText": "VND 150,000",
                          "originalAmount": 150000,
                          "originalAmountText": "VND 150,000",
                          "discountPercent": 0,
                          "discountAmount": 0,
                          "discountAmountText": "VND 0",
                          "currency": "VND",
                          "balance": 350000,
                          "balanceText": "VND 350,000"
                        }
                      }
                    },
                    "manualSlotProduct": {
                      "summary": "Catalog slot order accepted for fulfillment",
                      "value": {
                        "success": true,
                        "lang": "vi",
                        "order": {
                          "orderCode": "ORDER1M2A3N4U5A",
                          "status": "paid",
                          "productId": "64f0c0f2b90c2b4c5a654321",
                          "productName": "Claude Team Slot",
                          "productType": "slot",
                          "quantity": 1,
                          "bonusQuantity": 0,
                          "finalQuantity": 1,
                          "customerEmail": "buyer@example.com",
                          "fulfillmentStatus": "waiting_seller",
                          "autoCompleted": false
                        },
                        "payment": {
                          "amount": 100000,
                          "amountText": "100.000 ₫",
                          "originalAmount": 100000,
                          "originalAmountText": "100.000 ₫",
                          "discountPercent": 0,
                          "discountAmount": 0,
                          "discountAmountText": "0 ₫",
                          "currency": "VND",
                          "balance": 250000,
                          "balanceText": "250.000 ₫"
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Invalid request / insufficient balance",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "examples": {
                    "insufficientBalance": {
                      "summary": "Wallet balance is not enough",
                      "value": {
                        "success": false,
                        "lang": "en",
                        "message": "Wallet balance is not enough",
                        "payment": {
                          "currency": "VND",
                          "balance": 20000,
                          "balanceText": "VND 20,000"
                        }
                      }
                    },
                    "missingCustomerEmail": {
                      "summary": "Slot purchase is missing customer_email",
                      "value": {
                        "success": false,
                        "lang": "en",
                        "message": "Missing customer_email"
                      }
                    },
                    "invalidSlotMonths": {
                      "summary": "slot_months is not one of the allowed durations",
                      "value": {
                        "success": false,
                        "lang": "en",
                        "message": "Invalid slot_months. Allowed values: 1, 3, 6, 12"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Invalid API key",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  }
                }
              }
            },
            "404": {
              "description": "Product not found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  }
                }
              }
            },
            "409": {
              "description": "Inventory not enough, purchase in progress, or idempotency conflict",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  }
                }
              }
            },
            "429": {
              "$ref": "#/components/responses/RateLimited"
            },
            "503": {
              "description": "Purchase protection is temporarily unavailable",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  }
                }
              }
            }
          }
        }
      }
    },
    "components": {
      "responses": {
        "RateLimited": {
          "description": "A buyer key, seller aggregate, source IP, or authentication-failure\nquota was exceeded. The abusive key or IP receives an escalating\ntemporary penalty for the relevant key, IP, or seller aggregate. Wait\nfor `Retry-After` before retrying.\n",
          "headers": {
            "Retry-After": {
              "description": "Seconds remaining before the request may be retried.",
              "schema": {
                "type": "integer",
                "minimum": 1,
                "example": 300
              }
            },
            "X-RateLimit-Limit": {
              "description": "Request limit for the bucket that rejected the request.",
              "schema": {
                "type": "integer",
                "example": 10
              }
            },
            "X-RateLimit-Remaining": {
              "description": "Requests remaining in the rejected bucket.",
              "schema": {
                "type": "integer",
                "minimum": 0,
                "example": 0
              }
            },
            "X-RateLimit-Reset": {
              "description": "Unix timestamp in seconds when the current block resets.",
              "schema": {
                "type": "integer",
                "example": 1785063900
              }
            },
            "X-RateLimit-Scope": {
              "description": "Bucket or active penalty that rejected the request, for example\n`products_buyer`, `products_seller`, `global_key`, `global_ip`,\n`auth_key`, `auth_ip`, `penalty_key`, `penalty_ip`,\n`penalty_seller`, or the edge-level `nginx_ip`.\n",
              "schema": {
                "type": "string",
                "example": "products_buyer"
              }
            },
            "X-RateLimit-Penalty-Level": {
              "description": "Escalating application penalty level. Level `0` means the\nrequest was rejected by the short Nginx burst limiter before it\nreached the application. Values above 5 use level-5 duration.\n",
              "schema": {
                "type": "integer",
                "minimum": 0,
                "example": 2
              }
            }
          },
          "content": {
            "application/json": {
              "schema": {
                "allOf": [
                  {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "rateLimit": {
                        "$ref": "#/components/schemas/RateLimitDetails"
                      }
                    }
                  }
                ]
              },
              "example": {
                "success": false,
                "code": "RATE_LIMITED",
                "message": "Too many requests. Please try again later.",
                "errors": [],
                "requestId": "d9cad039-fe44-4dea-af8d-94313ad86ae9",
                "retryable": true,
                "rateLimit": {
                  "scope": "products_buyer",
                  "penaltyLevel": 2,
                  "retryAfter": 300
                }
              }
            }
          }
        }
      },
      "schemas": {
        "RateLimitDetails": {
          "type": "object",
          "required": [
            "scope",
            "penaltyLevel",
            "retryAfter"
          ],
          "properties": {
            "scope": {
              "type": "string",
              "example": "products_buyer"
            },
            "penaltyLevel": {
              "type": "integer",
              "minimum": 0,
              "example": 2
            },
            "retryAfter": {
              "type": "integer",
              "minimum": 1,
              "example": 300
            }
          }
        },
        "ErrorResponse": {
          "type": "object",
          "properties": {
            "success": {
              "type": "boolean",
              "example": false
            },
            "lang": {
              "type": "string",
              "example": "en"
            },
            "message": {
              "type": "string",
              "example": "Invalid API key"
            },
            "payment": {
              "type": "object",
              "description": "Present when the error includes the buyer's current wallet balance.",
              "properties": {
                "currency": {
                  "type": "string",
                  "example": "VND"
                },
                "balance": {
                  "type": "number",
                  "example": 20000
                },
                "balanceText": {
                  "type": "string",
                  "example": "VND 20,000"
                }
              }
            }
          }
        },
        "ProductsResponse": {
          "type": "object",
          "properties": {
            "success": {
              "type": "boolean",
              "example": true
            },
            "lang": {
              "type": "string",
              "example": "en"
            },
            "walletCurrency": {
              "type": "string",
              "example": "VND"
            },
            "products": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Product"
              }
            }
          }
        },
        "BalanceResponse": {
          "type": "object",
          "properties": {
            "success": {
              "type": "boolean",
              "example": true
            },
            "lang": {
              "type": "string",
              "example": "en"
            },
            "botSource": {
              "type": "string",
              "example": "primary"
            },
            "walletCurrency": {
              "type": "string",
              "example": "VND"
            },
            "requester": {
              "type": "object",
              "properties": {
                "chatId": {
                  "type": "integer",
                  "example": 1336962312
                },
                "name": {
                  "type": "string",
                  "example": "buyer_demo"
                }
              }
            },
            "balance": {
              "type": "number",
              "example": 250000,
              "description": "Current spendable balance in the active wallet currency."
            },
            "balanceVnd": {
              "type": "number",
              "example": 250000,
              "nullable": true,
              "description": "Current VND balance. In USD mode, this is the raw VND component used for unified conversion."
            },
            "balanceUsd": {
              "type": "number",
              "example": 18.259259,
              "nullable": true
            },
            "balanceText": {
              "type": "string",
              "example": "VND 250,000"
            },
            "usdtBalance": {
              "type": "number",
              "example": 8,
              "description": "Raw USDT balance stored in the wallet."
            },
            "usdRate": {
              "type": "number",
              "example": 27000,
              "nullable": true,
              "description": "VND to USD conversion rate used for unified USD wallets."
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "nullable": true
            }
          }
        },
        "Product": {
          "type": "object",
          "required": [
            "productId",
            "name",
            "productType",
            "price",
            "availability",
            "promotions"
          ],
          "properties": {
            "productId": {
              "type": "string",
              "example": "64f0c0f2b90c2b4c5a123456",
              "description": "For ChatGPT Business Slot, this value is `slot_chatgpt_business`."
            },
            "name": {
              "type": "string",
              "example": "ChatGPT Plus"
            },
            "description": {
              "type": "string",
              "example": "Product description"
            },
            "image": {
              "type": "string",
              "example": "/uploads/product.png"
            },
            "emoji": {
              "type": "string",
              "example": "chatgpt"
            },
            "productType": {
              "type": "string",
              "enum": [
                "account",
                "slot",
                "upgrade_account"
              ],
              "example": "account"
            },
            "price": {
              "type": "object",
              "required": [
                "amount",
                "currency",
                "text"
              ],
              "properties": {
                "amount": {
                  "type": "number",
                  "example": 50000
                },
                "currency": {
                  "type": "string",
                  "example": "VND"
                },
                "text": {
                  "type": "string",
                  "example": "50.000 ₫"
                }
              }
            },
            "availability": {
              "type": "object",
              "properties": {
                "available": {
                  "type": "number",
                  "example": 60,
                  "nullable": true
                },
                "sold": {
                  "type": "number",
                  "example": 40
                }
              }
            },
            "promotions": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "type": {
                    "type": "string",
                    "example": "bulk_discount"
                  },
                  "minQty": {
                    "type": "number",
                    "example": 3
                  },
                  "percent": {
                    "type": "number",
                    "example": 10
                  },
                  "bonusQty": {
                    "type": "number",
                    "example": 1
                  }
                }
              }
            },
            "purchaseRequirements": {
              "type": "object",
              "description": "Present only when the slot or upgrade flow requires additional buyer input.",
              "properties": {
                "customerEmail": {
                  "type": "boolean",
                  "example": true
                },
                "slotMonths": {
                  "type": "boolean",
                  "example": true
                },
                "quantityFixed": {
                  "type": "integer",
                  "example": 1
                },
                "allowedMonths": {
                  "type": "array",
                  "items": {
                    "type": "integer"
                  },
                  "example": [
                    1,
                    3,
                    6,
                    12
                  ]
                }
              }
            }
          }
        },
        "PurchaseRequest": {
          "type": "object",
          "required": [
            "key",
            "product_id"
          ],
          "properties": {
            "key": {
              "type": "string",
              "example": "tgb_1234567890abcdef1234567890abcdef1234567890abcdef"
            },
            "product_id": {
              "type": "string",
              "example": "64f0c0f2b90c2b4c5a123456"
            },
            "quantity": {
              "type": "integer",
              "default": 1,
              "example": 2,
              "description": "For ChatGPT Business Slot and catalog slot products, omit this field or keep it at `1`."
            },
            "customer_email": {
              "type": "string",
              "example": "buyer@example.com",
              "description": "Required when `product_id` is `slot_chatgpt_business` or the selected catalog product has `productType = slot`."
            },
            "slot_months": {
              "type": "integer",
              "example": 3,
              "description": "Required only when `product_id` is `slot_chatgpt_business`. Must be one of the `purchaseRequirements.allowedMonths` values returned by `/products`. Do not send it for catalog slot products."
            }
          }
        },
        "PurchaseResponse": {
          "type": "object",
          "required": [
            "success",
            "lang",
            "order",
            "payment"
          ],
          "properties": {
            "success": {
              "type": "boolean",
              "example": true
            },
            "lang": {
              "type": "string",
              "example": "en"
            },
            "order": {
              "type": "object",
              "required": [
                "orderCode",
                "status",
                "productName",
                "productType",
                "quantity",
                "bonusQuantity",
                "finalQuantity"
              ],
              "properties": {
                "orderCode": {
                  "type": "string",
                  "example": "ORDER1A2B3C4D5E"
                },
                "status": {
                  "type": "string",
                  "example": "completed"
                },
                "productId": {
                  "type": "string",
                  "example": "64f0c0f2b90c2b4c5a654321"
                },
                "productName": {
                  "type": "string",
                  "example": "ChatGPT Plus"
                },
                "productType": {
                  "type": "string",
                  "enum": [
                    "account",
                    "slot",
                    "upgrade_account"
                  ]
                },
                "quantity": {
                  "type": "integer",
                  "example": 2
                },
                "bonusQuantity": {
                  "type": "integer",
                  "example": 1
                },
                "finalQuantity": {
                  "type": "integer",
                  "example": 3
                },
                "slotMonths": {
                  "type": "integer",
                  "example": 3
                },
                "customerEmail": {
                  "type": "string",
                  "example": "buyer@example.com"
                },
                "fulfillmentStatus": {
                  "type": "string",
                  "example": "waiting_seller"
                },
                "autoCompleted": {
                  "type": "boolean",
                  "example": false
                }
              }
            },
            "payment": {
              "type": "object",
              "required": [
                "amount",
                "amountText",
                "originalAmount",
                "originalAmountText",
                "discountPercent",
                "discountAmount",
                "discountAmountText",
                "currency",
                "balance",
                "balanceText"
              ],
              "properties": {
                "amount": {
                  "type": "number",
                  "example": 90000
                },
                "amountText": {
                  "type": "string",
                  "example": "VND 90,000"
                },
                "originalAmount": {
                  "type": "number",
                  "example": 100000
                },
                "originalAmountText": {
                  "type": "string",
                  "example": "VND 100,000"
                },
                "discountPercent": {
                  "type": "number",
                  "example": 10
                },
                "discountAmount": {
                  "type": "number",
                  "example": 10000
                },
                "discountAmountText": {
                  "type": "string",
                  "example": "VND 10,000"
                },
                "currency": {
                  "type": "string",
                  "example": "VND"
                },
                "balance": {
                  "type": "number",
                  "example": 120000
                },
                "balanceText": {
                  "type": "string",
                  "example": "VND 120,000"
                }
              }
            },
            "delivery": {
              "type": "object",
              "properties": {
                "accounts": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "user": {
                        "type": "string"
                      },
                      "password": {
                        "type": "string"
                      },
                      "verifyEmail": {
                        "type": "string",
                        "nullable": true
                      },
                      "expiryText": {
                        "type": "string",
                        "nullable": true
                      },
                      "otherInfo": {
                        "type": "string",
                        "nullable": true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "customOptions": {},
  "swaggerUrl": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.preauthorizeApiKey) {
    const key = customOptions.preauthorizeApiKey.authDefinitionKey;
    const value = customOptions.preauthorizeApiKey.apiKeyValue;
    if (!!key && !!value) {
      const pid = setInterval(() => {
        const authorized = ui.preauthorizeApiKey(key, value);
        if(!!authorized) clearInterval(pid);
      }, 500)

    }
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
