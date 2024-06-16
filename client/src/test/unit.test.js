import { describe, expect, test } from "@jest/globals";
import { applyFilter } from "../Features/applyFIlter";
import fabricCanvas from "../app/js/editorFunction";
import mapFilter from "../entities/mapFilter";
import { removeBgPost, generateImagePost } from "../app/js/editorFunction";

const testImageObj = fabricCanvas.getActiveObject();
const json = { base64: removeBgImage, uid: 10000000001 };

describe("Тестирование функций фоторедактора", () => {
  test("Тестирование работы функции по применению фильтра", () => {
    mapFilter.get("contrast").value = 100;
    applyFilter("contrast", fabricCanvas);
    expect(100).toBe(testImageObj.filters[2]);
  });
});
describe("Тестирование API запрсоов", async () => {
  test("Тестирование генерации картинок", async () => {
    const requestBody = {
      prompt: "Текстовый запрос",
    };
    const responseGenerateImage = await generateImagePost(
      "http://127.0.0.1:8000/ai/generate/model",
      requestBody
    );
    const responseJson = responseGenerateImage.json();
    json.base64 = responseJson[0].image;
    expect(responseGenerateImage.status).toBe(200);
  });
  test("Тестирование удаления фона картинки", async () => {
    const responseRemoveBg = await removeBgPost(
      "http://localhost:8000/ai/remove/bg",
      json
    );
    expect(responseRemoveBg.status).toBe(200);
  });
});
