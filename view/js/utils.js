function ajaxPromise(url, method, type, data = undefined) {
  console.log("url", url);
  console.log("data", data);
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      contentType: "application/x-www-form-urlencoded",
      success: function (response) {
        resolve(response);
      },
      error: function (xhr, status, error) {
        console.error("Error en AJAX:", status, error);
        reject(error);
      },
    });
  });
}
