library(jsonlite)
library(effsize)

cohen <- function(json_text) {
  data <- fromJSON(json_text)
  values <- c(data[[1]], data[[2]])
  groups <- c(rep("M", length(data[[1]])), rep("F", length(data[[2]])))
  result <- cohen.d(values ~ groups)
  result$estimate
}